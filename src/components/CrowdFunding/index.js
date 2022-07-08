import React, { Component } from "react";
import cons from "../../cons.js";
const BigNumber = require('bignumber.js');


export default class CrowdFunding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      min: 100,
      deposito: "Loading...",
      balance: "Loading...",
      accountAddress: "Loading...",
      porcentaje: "Loading...",
      dias: "Loading...",
      partner: "Loading...",
      balanceTRX: "Loading...",
      balanceUSDT: "Loading...",
      precioSITE: 1,
      valueUSDT: 0,
      hand: 0,
      cantidadBlokes: 1,
      valorBlokes: 30,
      valorBloke: 30,
      tiempo: 0,
      estadoBuy: "Loading...",
      buyMembership: "Buy $10/YEAR",
      datos: [
        {
            "blks": 0,
            "team": 0,
            "refer": 0,
            "pasive": 0
        },
        {
            "blks": 0,
            "team": 0,
            "refer": 0,
            "pasive": 0
        },
        {
            "blks": 0,
            "team": 0,
            "refer": 0,
            "pasive": 0
        }
      ],
      balanceInfinito: 0

    };

    this.deposit = this.deposit.bind(this);
    this.estado = this.estado.bind(this);
    this.estado2 = this.estado2.bind(this);

    this.hijos = this.hijos.bind(this);
    this.buscaren = this.buscaren.bind(this);

    this.handleChangeA = this.handleChangeA.bind(this);
    this.handleChangeB = this.handleChangeB.bind(this);

    
  }

  handleChangeA(event) {
    var evento = event.target.value;
    this.setState({
      cantidadBlokes: evento,
      valorBlokes: evento * this.state.valorBloke,
    });
  }

  handleChangeB(event) {
    var evento = event.target.value;
    this.setState({
      valorBlokes: evento,
      cantidadBlokes: evento / this.state.valorBloke,
    });
  }

  async componentDidMount() {
    
    this.setState({
      currentAccount: this.props.currentAccount,
    });
    setInterval(async() => {
      var verWallet = this.props.currentAccount;

      if(!this.props.wallet.web3.utils.isAddress(verWallet)){
        verWallet = await this.props.wallet.contractBinary.methods
        .idToAddress(verWallet)
        .call({ from: "0x0000000000000000000000000000000000000000" });
      }
      this.setState({
        currentAccount: verWallet,
      });
      this.estado();
      this.estado2();
      this.hijos();
    }, 3 * 1000);
  }


  async buscaren(base, paso, hasta){

    for (let index = 0; index < base[paso].length; index++) {

      var columnHijos = await this.props.wallet.contractBinary.methods
      .columnHijos(base[paso][index])
      .call({ from: this.state.currentAccount });

      if(columnHijos === false){

      }else{
        base[paso+1] = [].concat(columnHijos,base[paso+1]);
      }
      
    }

    //console.log(base)

    paso++;

    if(paso < hasta ){
      return await this.buscaren(base, paso, hasta);

    }else{
      return base;
    }

  }

  async hijos() {

    var niveles = [[],[],[]]
    var porcentajes = [0.09, 0.03, 0.01]
    var datos = [
      {refer: 0, blks: 0, team: 0, pasive: 0},
      {refer: 0, blks: 0, team: 0, pasive: 0},
      {refer: 0, blks: 0, team: 0, pasive: 0}
    ];

    var columnHijos = await this.props.wallet.contractBinary.methods
    .columnHijos(this.state.currentAccount)
    .call({ from: this.state.currentAccount });

    niveles[0] = columnHijos;

    var investor;

    niveles = await this.buscaren(niveles, 0, 2);

    for (let index = 0; index < niveles.length; index++) {
      for (let sub = 0; sub < niveles[index].length; sub++) {

        investor = await this.props.wallet.contractBinary.methods
        .investors( niveles[index][sub])
        .call({ from: this.state.currentAccount });

        var blokes = new BigNumber(investor.invested).shiftedBy(-18);

        datos[index].blks  += blokes.dividedBy(30).toNumber(10);
        datos[index].pasive  += blokes.toNumber(10);
        datos[index].refer  += blokes.multipliedBy(porcentajes[index]).toNumber(10);

      }

      datos[index].team = parseInt(niveles[index].length);

    }

    this.setState({
      datos: datos
    })

  }

  async estado() {
    var inversors = await this.props.wallet.contractBinary.methods
      .investors(this.state.currentAccount)
      .call({ from: this.state.currentAccount });

    var tiempo = ((inversors.membership - Date.now() / 1000) / 86400).toFixed(
      0
    );
    var buyMembership = "Buy $10/YEAR";

    if (tiempo <= 0) {
      tiempo = "Please buy a membership";
    } else {
      tiempo = tiempo + " days left";
      buyMembership = "Active!";
    }

    this.setState({
      tiempo: tiempo,
      buyMembership: buyMembership,
    });
  }

  async estado2() {
    var accountAddress = this.state.currentAccount;
    var inversors = await this.props.wallet.contractBinary.methods
      .investors(this.state.currentAccount)
      .call({ from: this.state.currentAccount });

    var inicio = accountAddress.substr(0, 4);
    var fin = accountAddress.substr(-4);

    var texto = inicio + "..." + fin;

    document.getElementById(
      "login"
    ).href = `https://bscscan.com/address/${accountAddress}`;
    document.getElementById("login-my-wallet").innerHTML = texto;

    document.getElementById("avatar").src = document.getElementById("avatarImage").src;

    var nameToken1 = await this.props.wallet.contractToken.methods
      .symbol()
      .call({ from: this.state.currentAccount });

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(accountAddress, this.props.contractAddress)
      .call({ from: this.state.currentAccount });

    if (aprovado > 0) {
      if (!inversors.registered) {
        aprovado = "Membership";
      } else {
        aprovado = "Buy";
      }
    } else {
      aprovado = "Allow";
    }

    inversors.inicio = 1000;

    var tiempo = await this.props.wallet.contractBinary.methods
      .tiempo()
      .call({ from: this.state.currentAccount });

    tiempo = tiempo * 1000;

    var porcentiempo = ((Date.now() - inversors.inicio) * 100) / tiempo;

    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var balance = await this.props.wallet.contractToken.methods
      .balanceOf(this.state.currentAccount)
      .call({ from: this.state.currentAccount });

    balance = balance / 10 ** decimales;

    var valorPlan = 0;

    if (porcentiempo < 100) {
      aprovado = "Update Plan";

      valorPlan = inversors.plan / 10 ** 8;
    }

    var partner = cons.WS;

    if (inversors.registered) {
      partner = await this.props.wallet.contractBinary.methods
        .padre(this.state.currentAccount)
        .call({ from: this.state.currentAccount });
    } else {
      var loc = document.location.href;
      if (loc.indexOf("?") > 0) {
        var getString = loc.split("?");
        //console.log(getString)
        getString = getString[getString.length - 1];
        //console.log(getString);
        var GET = getString.split("&");
        var get = {};
        for (var i = 0, l = GET.length; i < l; i++) {
          var tmp = GET[i].split("=");
          get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }

        if (get["ref"]) {
          tmp = get["ref"].split("#");

          var wallet = tmp[0];
          if (!this.props.wallet.web3.utils.isAddress(wallet)) {
            wallet = await this.props.wallet.contractBinary.methods
            .idToAddress(tmp[0])
            .call({ from: this.state.currentAccount });
          }

          inversors = await this.props.wallet.contractBinary.methods
            .investors(wallet)
            .call({ from: this.state.currentAccount });
          //console.log(wallet);
          if (inversors.registered) {
            partner = wallet;
          }
        }
      }
    }

    if (partner === "0x0000000000000000000000000000000000000000") {
      partner = "---------------------------------";
    }

    var dias = 365; //await Utils.contract.tiempo().call();

    var porcentaje = await this.props.wallet.contractBinary.methods
      .porcent()
      .call({ from: this.state.currentAccount });

    porcentaje = parseInt(porcentaje);

    var decimals = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var balanceUSDT = await this.props.wallet.contractToken.methods
      .balanceOf(this.state.currentAccount)
      .call({ from: this.state.currentAccount });

    balanceUSDT = parseInt(balanceUSDT) / 10 ** decimals;

    this.setState({
      deposito: aprovado,
      balance: valorPlan,
      decimales: decimales,
      accountAddress: accountAddress,
      porcentaje: porcentaje,
      dias: dias,
      partner: partner,
      balanceSite: balance,
      balanceUSDT: balanceUSDT,
      nameToken1: nameToken1,
      balanceInfinito: new BigNumber(inversors.balanceInfinit).shiftedBy(-18).toNumber()
    });
  }

  async deposit() {
    var { balanceSite, balance } = this.state;

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.state.currentAccount, this.props.contractAddress)
      .call({ from: this.state.currentAccount });

    if (aprovado <= 0) {
      await this.props.wallet.contractToken.methods
        .approve(
          this.props.contractAddress,
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        )
        .send({ from: this.state.currentAccount });
      window.alert("Balance approval for exchange: successful");
      return;
    }
    var blokes = document.getElementById("b").value;
    var amount = blokes;
    amount = amount - balance;

    if (aprovado > 0 && balanceSite >= amount) {
      var loc = document.location.href;
      var sponsor = cons.WS;
      var investors = await this.props.wallet.contractBinary.methods
        .investors(this.state.currentAccount)
        .call({ from: this.state.currentAccount });

      if (investors.registered) {
        sponsor = await this.props.wallet.contractBinary.methods
          .padre(this.state.currentAccount)
          .call({ from: this.state.currentAccount });
      } else {
        if (loc.indexOf("?") > 0) {
          var getString = loc.split("?");
          getString = getString[getString.length - 1];
          //console.log(getString);
          var GET = getString.split("&");
          var get = {};
          for (var i = 0, l = GET.length; i < l; i++) {
            var tmp = GET[i].split("=");
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
          }

          if (get["ref"]) {
            tmp = get["ref"].split("#");

            var wallet = await this.props.wallet.contractBinary.methods
              .idToAddress(tmp[0])
              .call({ from: this.state.currentAccount });

            var padre = await this.props.wallet.contractBinary.methods
              .investors(wallet)
              .call({ from: this.state.currentAccount });

            if (padre.registered) {
              sponsor = wallet;
            }
          }
        }
      }

      if (
        !investors.registered &&
        sponsor !== "0x0000000000000000000000000000000000000000"
      ) {
        var datos = {};
        datos.name = await prompt("please set a nikname");
        datos.bio = await prompt("please set a bio");
        datos.image = await prompt("please set a image link");

        var reg = this.props.wallet.contractBinary.methods
          .registro(sponsor, JSON.stringify(datos))
          .send({ from: this.state.currentAccount });
        reg.then(() => window.alert("Congratulation registration: successful"));
        return;
      } else {
        if (!investors.registered) {
          alert("you need a referral link to register");
          return;
        }
      }

      blokes = new BigNumber(blokes).shiftedBy(18);

      this.props.wallet.contractBinary.methods
        .buyBlocks(blokes.toString(10))
        .send({ from: this.state.currentAccount })
        .then(() => {
          window.alert("Felicidades inversión exitosa");
        });

    } else {
      if (balanceSite < amount) {
        window.alert(
          "You do not have enough balance, you need: " +
            amount +
            " USDT and in your wallet you have: " +
            balanceSite
        );
      }
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col s12">
          <div className="container">
            <div className="row vertical-modern-dashboard">
              <div className="col s12 m6 l6 card padding-3 animate fadeLeft gradient-45deg-blue-indigo white-text">
                <div className="row">
                  <div className="col s12 m12 center-align">
                    <i className="material-icons background-round mt-1 mb-0">
                      perm_identity
                    </i>
                    <p className="mb-0 center-align break">
                      Upline: <br /> {this.state.partner}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col s12 m6 l6 card-width">
                <div className="card card-border center-align gradient-45deg-indigo-purple">
                  <div className="card-content white-text">
                    <div className="col s12">
                      <i className="material-icons right">favorite</i>
                    </div>
                    <h5 className="white-text mb-1">Membership</h5>
                    <p className="m-0">{this.state.tiempo}</p>
                    <button
                      onClick={async () => {
                        var aprovado = await this.props.wallet.contractToken.methods
                          .allowance(this.state.currentAccount, this.props.contractAddress)
                          .call({ from: this.state.currentAccount });

                        if (aprovado <= 0) {
                          await this.props.wallet.contractToken.methods
                            .approve(
                              this.props.contractAddress,
                              "115792089237316195423570985008687907853269984665640564039457584007913129639935"
                            )
                            .send({ from: this.state.currentAccount });
                          window.alert("Balance approval for exchange: successful");
                          return;
                        }

                        var loc = document.location.href;
                        var sponsor = cons.WS;
                        var investors =
                          await this.props.wallet.contractBinary.methods
                            .investors(this.state.currentAccount)
                            .call({ from: this.state.currentAccount });

                        if (investors.registered) {
                          sponsor =
                            await this.props.wallet.contractBinary.methods
                              .padre(this.state.currentAccount)
                              .call({ from: this.state.currentAccount });
                        } else {
                          if (loc.indexOf("?") > 0) {
                            var getString = loc.split("?");
                            getString = getString[getString.length - 1];
                            //console.log(getString);
                            var GET = getString.split("&");
                            var get = {};
                            for (var i = 0, l = GET.length; i < l; i++) {
                              var tmp = GET[i].split("=");
                              get[tmp[0]] = unescape(decodeURI(tmp[1]));
                            }

                            if (get["ref"]) {
                              tmp = get["ref"].split("#");

                              var wallet =
                                await this.props.wallet.contractBinary.methods
                                  .idToAddress(tmp[0])
                                  .call({ from: this.state.currentAccount });

                              var padre =
                                await this.props.wallet.contractBinary.methods
                                  .investors(wallet)
                                  .call({ from: this.state.currentAccount });

                              if (padre.registered) {
                                sponsor = wallet;
                              }
                            }
                          }
                        }
                      if(sponsor !== "0x0000000000000000000000000000000000000000" ){
                        var datos = {};
                        datos.name = await prompt("please set a nikname");
                        datos.bio = await prompt("please set a bio");
                        datos.image = await prompt("please set a image link");

                        this.props.wallet.contractBinary.methods
                          .registro(sponsor, JSON.stringify(datos))
                          .send({ from: this.state.currentAccount })
                          .then(() => {
                            window.alert("membership buyed");
                          });
                      }else{
                        window.alert("You need a referal link");
                      }
                      }}
                      className="waves-effect waves-light btn gradient-45deg-deep-orange-orange border-round mt-7 z-depth-4"
                    >
                      {this.state.buyMembership}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col s12 m12 l12 card padding-4 animate fadeLeft gradient-45deg-blue-indigo white-text">
                  
                <div className="row">
                  <div className="col s2 m2 center-align">
                  <img
                        src="app-assets/images/bloque.png"
                        alt="block"
                        className="width-40"
                      />
                    <p className="mb-0">Blocks</p>
                  </div>
                  <div className="col s3 m2 center-align">
                    <h5 className="mb-0 white-text">X</h5>
                  </div>
                  <div className="col s2 m2 center-align">
                    <input
                      id="a"
                      type="number"
                      className="form-control center-align white-text"
                      value={this.state.cantidadBlokes}
                      onChange={this.handleChangeA}
                      step={1}
                    />
                    <p className="mb-0">Quantity {this.state.cantidadBlokes} BLKS</p>
                  </div>
                  <div className="col s2 m2 center-align">
                    <h5 className="mb-0 white-text">=</h5>
                  </div>
                  <div className="col s2 m2 center-align">
                    <input
                      id="b"
                      type="number"
                      className="form-control center-align white-text"
                      value={this.state.valorBlokes}
                      onChange={this.handleChangeB}
                      step={this.state.valorBloke}
                    /> 
                    <p className="mb-0">Total: $ {this.state.valorBlokes} </p>
                  </div>
                  <div className="col s2 m2 center-align mt-1">
                    <button
                      className="mb-6 btn waves-effect waves-light cyan"
                      onClick={() => this.deposit()}
                    >
                      {this.state.deposito}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col s12 m12 l12">
                <div className="card subscriber-list-card animate fadeRight">
                  <div className="card-content pb-1">
                      <h4 className="card-title mb-0">My team Status <i className="material-icons float-right">more_vert</i></h4>
                  </div>
                  <table className="subscription-table responsive-table highlight">
                      <thead>
                          <tr>
                              <th>Level</th>
                              <th>Team</th>
                              <th>Blocks</th>
                              <th>Capital</th>
                              <th>Referrals</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Level 1</td>
                              <td><b>{this.state.datos[0].team}</b></td>
                              <td><b>{this.state.datos[0].blks}</b></td>
                              <td><span className="badge orange-text text-accent-4">${this.state.datos[0].pasive.toFixed(2)}</span></td>
                              <td><span className="badge green-text text-accent-4">${this.state.datos[0].refer.toFixed(2)}</span></td>
                          </tr>
                          <tr>
                              <td>Level 2</td>
                              <td><b>{this.state.datos[1].team}</b></td>
                              <td><b>{this.state.datos[1].blks}</b></td>
                              <td><span className="badge orange-text text-accent-4">${this.state.datos[1].pasive.toFixed(2)}</span></td>
                              <td><span className="badge green-text text-accent-4">${this.state.datos[1].refer.toFixed(2)}</span></td>
                          </tr>
                          <tr>
                              <td>Level 3</td>
                              <td><b>{this.state.datos[2].team}</b></td>
                              <td><b>{this.state.datos[2].blks}</b></td>
                              <td><span className="badge orange-text text-accent-4">${this.state.datos[2].pasive.toFixed(2)}</span></td>
                              <td><span className="badge green-text text-accent-4">${this.state.datos[2].refer.toFixed(2)}</span></td>
                          </tr>
                          <tr>
                              <td><b>Total</b></td>
                              <td><b>{this.state.datos[0].team+this.state.datos[1].team+this.state.datos[2].team}</b></td>
                              <td><b>{this.state.datos[0].blks+this.state.datos[1].blks+this.state.datos[2].blks}</b></td>
                              <td><span className="badge orange-text text-accent-4">${(this.state.datos[0].pasive+this.state.datos[1].pasive+this.state.datos[2].pasive).toFixed(2)}</span></td>
                              <td><span className="badge green-text text-accent-4">${(this.state.datos[0].refer+this.state.datos[1].refer+this.state.datos[2].refer).toFixed(2)}</span></td>
                          </tr>
                      </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
          <div className="content-overlay"></div>
        </div>
      </div>
    );
  }
}
