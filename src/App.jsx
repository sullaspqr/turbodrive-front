import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import sha256 from "js-sha256";
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min";

export const App=() => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;
    if (vantaRef.current) {
      try {
        vantaEffect = WAVES({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 150.0,
          minWidth: 150.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x001f3f,
          color1: 0xff4500,
          color2: 0x28a745,
        });
      } catch (error) {
        console.error("[vanta.js] waves init error:", error);
      }
    }
  
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const saltResponse = await axios.post(
        `https://localhost:5001/api/Login/GetSalt/${loginName}`
      );
      const salt = saltResponse.data;
      const tmpHash = sha256(password + salt.toString());
      const loginResponse = await axios.post("https://localhost:5001/api/Login", {
        loginName,
        tmpHash,
      });

      if (loginResponse.status === 200) {
        const user = loginResponse.data;
        alert("Sikeres bejelentkezés!");
        setAvatar(`http://images.balazska.nhely.hu/${user.profilePicturePath}`);
      } else {
        alert("Hiba történt a bejelentkezéskor!");
      }
    } catch (error) {
      alert("Hiba történt: " + error.message);
    }
  };

  return (
    <div ref={vantaRef} style={{ height: "100vh", color: "#fff", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h2>Bejelentkezés</h2>
        <input
          type="text"
          placeholder="Felhasználónév"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          style={{ margin: "10px", padding: "10px", borderRadius: "5px", width: "80%" }}
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "10px", padding: "10px", borderRadius: "5px", width: "80%" }}
        />
        <button
          onClick={handleLogin}
          style={{
            margin: "10px",
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#1e90ff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Bejelentkezés
        </button>
        {avatar && (
          <div>
            <img src={avatar} alt="Avatar" style={{ marginTop: "20px", borderRadius: "50%" }} />
          </div>
        )}
      </div>
    </div>
  );
}


