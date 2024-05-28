import logo from "./logo.svg";
import "./App.css";
import { Component } from "react";
import ReactLoading from "react-loading";

class App extends Component {
  state = {
    selectedItem: false,
    // baseUrl: "https://node-api-muxu.onrender.com",
    baseUrl: "http://localhost:8081",
    priceLists: [],
    productValue: 0,
    token: "",
    error: {},
    success: "",
    isLoading: false,
    selectedWaresInfo: undefined,
    userData: {
      open_id: "",
      identityId: "",
      identityType: "CUSTOMER",
      walletIdentityId: "202000000000146178",
      identifierType: "MSISDN",
      identifier: "", //PhoneNumber
      nickName: "", // FirstName
      status: "", // Default is 03 it means active
    },
  };

  selectProduct(itemIndex) {
    this.setState({ product: itemIndex });
  }

  handleAuthLogin = () => {
    window.handleinitDataCallback = (token) => {
      this.requestAuthData(token);
    };
    this.setState({
      ...this.state,
      isLoading: true,
    });
    let obj = JSON.stringify({
      functionName: "js_fun_h5GetAccessToken",
      params: {
        appid: "930231098009602",
        functionCallBackName: "handleinitDataCallback",
      },
    });
    window.consumerapp.evaluate(obj);
  };

  requestAuthData = (token) => {
    window
      .fetch(this.state.baseUrl + "/apply/h5token", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authToken: token,
        }),
      })
      .then((res) => {
        res
          .text()
          .then((resAuth) => {
            console.log("resAuth", resAuth);
            if (!resAuth) return;
            if (!window.consumerapp) {
              console.log("this page is not open in app");
              return;
            }
            alert(resAuth);
            this.handleUserData(resAuth);
          })
          .catch((error) => {
            console.log("error found");
            alert(error);
          });
      })
      .catch((ex) => {
        alert("Exception found", ex);
      })
      .finally(() => {
        this.setState({
          ...this.state,
          isLoading: false,
        });
      });
  };

  handleUserData = (user) => {
    // const {
    //   open_id,
    //   identityId,
    //   identityType,
    //   walletIdentityId,
    //   identifierType,
    //   identifier,
    //   nickName,
    //   status,
    // } = user.biz_content;
    //Setting incoming data from from superApp server.
    // this.setState({
    //   ...this.state,
    //   success: "SUCCESS",
    //   userData: {
    //     ...this.state.userData,
    //     open_id: open_id,
    //     identityId: identityId,
    //     identityType: identityType,
    //     walletIdentityId: walletIdentityId,
    //     identifier: identifier, //Phone no
    //     nickName: nickName, // FirstName
    //     status: status,
    //   },
    // });
  };

  render() {
    const { nickName } = this.state.userData;

    const userRender = (
      <div>
        <button
          className="b"
          type="button"
          id="buy"
          onClick={() => this.handleAuthLogin()}
        >
          Login with Telebirr
        </button>

        <div className="content">
          <p>Amount</p>
          <div className="amount" id="product_list">
            <div onClick={() => this.selectProduct(10)} class="per perb">
              <div class="tips">
                <img lt="nkd" src="img/diamonds_1.png" />
              </div>
              <div className="dscription">
                <div className="bg1">diamond_1</div>
                <div className="bg2 fn2">10 USD</div>
              </div>
            </div>
            <div onClick={() => this.selectProduct(20)} className="per perb">
              <div className="tips">
                <img alt="nkd" src="img/diamonds_1.png" />
              </div>
              <div className="dscription">
                <div className="bg1">diamond_2</div>
                <div className="bg2 fn2">20 USD</div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer" id="foot">
          <button className="b" type="button" id="buy" onClick="startPay();">
            Pay Super App
          </button>
        </div>
      </div>
    );

    return (
      <div className="App">
        <div className="home">{userRender}</div>
      </div>
    );
  }
}

export default App;
