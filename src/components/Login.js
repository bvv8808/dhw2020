const axios = require("axios");

const Login = ({ setUid }) => {
  return (
    <div className="loginContainer">
      <form>
        <div className="loginTitleBox">
          <h1>LOG IN</h1>
          <h4>내보낸 카카오톡</h4>
        </div>
        <div className="inputBox">
          <input
            className="inputLogin"
            type="text"
            name="uid"
            placeholder="ID"
          />
          <input
            className="inputLogin"
            type="password"
            name="pw"
            placeholder="PASSWORD"
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                const inputArr = document.getElementsByTagName("input");
                const inputs = [
                  inputArr[0].value || "",
                  inputArr[1].value || "",
                ];
                if (!inputs[0] || !inputs[1]) window.alert("no value in input");
                else {
                  axios
                    .post("http://127.0.0.1:3001/login", {
                      uid: inputs[0],
                      pw: inputs[1],
                    })
                    .then((res) => {
                      console.log("#res: ", res);
                      if (res.data.code) {
                        document.cookie = `uid=${inputs[0]}`;
                        setUid(inputs[0]);
                      } else window.alert("wrong account");
                    });
                }
              }
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
