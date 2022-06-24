import React, { Component } from "react";
const BigNumber = require('bignumber.js');
const lc = require('lower-case');


export default class Datos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalInvestors: 0,
      totalInvested: 0,
      totalRefRewards: 0,
      precioSITE: 1,
      wallet: "",
      plan: 0,
      cantidad: 0,
      hand: 0,
      WitdrawlsC: "loading..."
    };

    this.totalInvestors = this.totalInvestors.bind(this);
    this.asignarPlan = this.asignarPlan.bind(this);
    this.handleChangeWALLET = this.handleChangeWALLET.bind(this);
    this.handleChangeWALLET2 = this.handleChangeWALLET2.bind(this);
    this.handleChangeUPWALLET = this.handleChangeUPWALLET.bind(this);
    this.handleChangeVALUE = this.handleChangeVALUE.bind(this);
    this.handleChangeBLOKE = this.handleChangeBLOKE.bind(this);
    this.handleChangeCANTIDAD = this.handleChangeCANTIDAD.bind(this);


  }

  handleChangeWALLET(event) {
    var evento = event.target.value;
    this.setState({
      wallet: evento
    });
  }

  handleChangeWALLET2(event) {
    var evento = event.target.value;
    this.setState({
      wallet2: evento
    });
  }

  handleChangeUPWALLET(event) {
    var evento = event.target.value;
    this.setState({
      upWallet: evento
    });
  } 
  
  handleChangeVALUE(event) {
    var evento = event.target.value;
    this.setState({
      value: evento
    });
  }

  handleChangeBLOKE(event) {
    var evento = event.target.value;
    this.setState({
      bloke: evento
    });
  }

  handleChangeCANTIDAD(event){
    var evento = event.target.value;
    this.setState({
      cantidad: evento
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
      this.totalInvestors();
    }, 3 * 1000);
  }


  async totalInvestors() {

    var totalInvestors = await this.props.wallet.contractBinary.methods
    .totalInvestors()
    .call({ from: this.state.currentAccount });

    var totalInvested = await this.props.wallet.contractBinary.methods
    .totalInvested()
    .call({ from: this.state.currentAccount });

    var totalRefRewards = await this.props.wallet.contractBinary.methods
    .totalRefRewards()
    .call({ from: this.state.currentAccount });

    var totalRank = 0;//await this.props.wallet.contractBinary.methods
    //.totalRange()
    //.call({ from: this.state.currentAccount });

    var totalRoiWitdrawl = await this.props.wallet.contractBinary.methods
      .totalRoiWitdrawl()
      .call({ from: this.state.currentAccount });

    var totalRefWitdrawl = await this.props.wallet.contractBinary.methods
      .totalRefWitdrawl()
      .call({ from: this.state.currentAccount });

    var totalRangeWitdrawl = await this.props.wallet.contractBinary.methods
      .totalRangeWitdrawl()
      .call({ from: this.state.currentAccount });

    var totalTeamWitdrawl = await this.props.wallet.contractBinary.methods
      .totalTeamWitdrawl()
      .call({ from: this.state.currentAccount });

    
    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var isAdmin = await this.props.wallet.contractBinary.methods.admin(this.state.currentAccount).call({from:this.state.currentAccount});
    
    var WitdrawlsC = await this.props.wallet.contractBinary.methods.onOffWitdrawl().call({from:this.state.currentAccount});

    var owner = await this.props.wallet.contractBinary.methods.owner().call({from:this.state.currentAccount});

    var panelOwner = <></>;

    if(lc.lowerCase(owner) === lc.lowerCase(this.state.currentAccount)){
      isAdmin = true;
      panelOwner = (
        <>

      <div className="col l4 text-center">
        <p>
        Wallet User:{" "} <input type="text" onChange={this.handleChangeWALLET2} placeholder="0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d"/> 
        <br />
        Cantidad BLOKES:{" "} <input type="text" onChange={this.handleChangeBLOKE} placeholder="1 BLKS"/> 
        </p>

        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .asignarBlokePago(this.state.wallet2, this.state.bloke)
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            Asign BLOKE PAGO
          </button>
        </p>
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              var transaccion = await this.props.wallet.contractBinary.methods
                .makeNewAdmin2(this.state.wallet2)
                .send({ from: this.state.currentAccount });
              
              alert("verifica la transaccion " + transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            Asign admin 2
          </button>
        </p>
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              var transaccion = await this.props.wallet.contractBinary.methods
                .makeRemoveAdmin2(this.state.wallet2)
                .send({ from: this.state.currentAccount });
              
              alert("verifica la transaccion " + transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            remove Admin 2
          </button>
        </p>

        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              var transaccion = await this.props.wallet.contractBinary.methods
                .makeRemoveAdmin(this.state.wallet2)
                .send({ from: this.state.currentAccount });
              
              alert("verifica la transaccion " + transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            remove admin
          </button>
        </p>
      </div>

      <div className="col l4 text-center">
        <p>

          Time Contarct:{" "} <input type="text" onChange={this.handleChangeVALUE} placeholder="900 dias"/> 
        </p>
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .setTiempo(this.state.value)
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            Set Time
          </button>
        </p>
      </div>

      <div className="col l4 text-center">
        <p>

          Porcent Contarct:{" "} <input type="text" onChange={this.handleChangeVALUE} placeholder="240 %"/> 
        </p>
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .setRetorno(this.state.value)
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            Set percent
          </button>
        </p>
      </div>

      <div className="col l4 text-center">
        <p>

          Duration Membership:{" "} <input type="text" onChange={this.handleChangeVALUE} placeholder="365 days"/> 
        </p>
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .setduracionMembership(this.state.value)
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            Set duration
          </button>
        </p>
      </div>

      <div className="col l4 text-center">
        <p>

          Price Membership:{" "} <input type="text" onChange={this.handleChangeVALUE} placeholder="30 USDT"/> 
        </p>
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .setPrecioRegistro(this.state.value+"000000000000000000")
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            Set Price
          </button>
        </p>
      </div>

      <div className="col l4 text-center">
        <p>

        AMOUNT WT:{" "} <input type="text" onChange={this.handleChangeVALUE} placeholder="1000 USDT"/> 
        </p>
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .redimTokenPrincipal02(this.state.value)
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            withdraw
          </button>
        </p>
      </div>

      </>
      )
    }

    this.setState({
      totalInvestors: totalInvestors,
      totalInvested: totalInvested / 10 ** decimales,
      totalRefRewards: totalRefRewards / 10 ** decimales,
      totalRank: totalRank / 10 ** decimales,
      totalRoiWitdrawl: totalRoiWitdrawl / 10 ** decimales,
      totalRefWitdrawl: totalRefWitdrawl / 10 ** decimales,
      totalTeamWitdrawl: totalTeamWitdrawl / 10 ** decimales,
      totalRangeWitdrawl: totalRangeWitdrawl / 10 ** decimales,
      admin: isAdmin,
      WitdrawlsC: WitdrawlsC,
      panelOwner: panelOwner,
    });
  }

  async asignarPlan() {
    var transaccion = await this.props.wallet.contractBinary.methods
      .asignarMembership(this.state.wallet, this.state.upWallet)
      .send({ from: this.state.currentAccount });
    
    alert("verifica la transaccion " + transaccion.transactionHash);
    setTimeout(
      window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
      3000
    );
    this.setState({ plan: 0 });
  }

  render() {
    if (this.state.admin === true) {
      return (
        <div className="container">
          <div className="row">
            <div className="col l4 text-center text-white">
              <h3>{this.state.totalInvestors}</h3>
              <p>Investor Global</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalInvested).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total invested</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalInvested/50).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total bloks</p>
            </div>

            <div className="col l12 text-center text-white">
              <hr></hr>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalInvested*2.4).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total ROI</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalInvested* 0.012 * 30).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total Infinity ♾</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalRefRewards).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total referer Rewards</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalRank).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total Rank Rewards</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {((this.state.totalInvested*2.4)+(this.state.totalInvested* 0.012 * 30)+this.state.totalRefRewards+this.state.totalRank).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total To Pay</p>
            </div>

            <div className="col l12 text-center text-white">
              <hr></hr>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalRoiWitdrawl).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total roi witdrawl</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalRefWitdrawl).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total Infinity witdrawl</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalTeamWitdrawl).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total Team referal witdrawl</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>
                {(this.state.totalRangeWitdrawl).toFixed(2) }{" "}
                USDT
              </h3>
              <p>Total Rank witdrawl</p>
            </div>

            <div className="col l4 text-center text-white">
              <h3>{(this.state.totalRoiWitdrawl+this.state.totalRefWitdrawl+this.state.totalTeamWitdrawl+this.state.totalRangeWitdrawl).toFixed(2)} USDT</h3>
              <p>Global witdrawl</p>
            </div>


          </div>
          <hr></hr>
          <div className="row">

            <div className="col l4 text-center">
              <p>
              Wallet:{" "} <input type="text" onChange={this.handleChangeWALLET} placeholder="0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d"/> 
              </p>
              <p>
              UPLINE:{" "} <input type="text" onChange={this.handleChangeUPWALLET} placeholder="0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d"/> 
              </p>

              <p>
                <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var user = await this.props.wallet.contractBinary.methods.investors(this.state.wallet).call({from:this.state.currentAccount});
                    var userInfinity = await this.props.wallet.contractInfinity.methods.investors(this.state.wallet).call({from:this.state.currentAccount});
              
                    var withdrawableInfinity = await this.props.wallet.contractInfinity.methods.withdrawable(this.state.wallet, true).call({from:this.state.currentAccount});
                    
                    if((userInfinity.invested > 0 || withdrawableInfinity > 0) && !user.registered){
              
                      var sponsor = await this.props.wallet.contractInfinity.methods.padre(this.state.wallet).call({from:this.state.currentAccount});
                      var SponsorInfinity = await this.props.wallet.contractBinary.methods.investors(sponsor).call({from:this.state.currentAccount});
              
                      var isOk = await window.confirm("Is corect this upline?:\n"+sponsor);
                      if(SponsorInfinity.registered){
                        
                        if(isOk){
                          this.props.wallet.contractBinary.methods.inMigracion(this.state.wallet, sponsor).send({from:this.state.currentAccount})
                          .then(()=>{alert("corect updating contract to v2")})
                          .catch(()=>{alert("there were problems updating ")})
                        }
                      }else{
                        alert("upline:\n"+sponsor+"\n is not migrated, please migrate");
                      }
                      
                    }else{
                      alert("no have invested or infinity pending balance")
                    }
                  }}
                >
                  Migrate USER to V2
                </button>
              </p>
                 
              <p>
                <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={() => this.asignarPlan()}
                >
                  assign free membership
                </button>
              </p>
              <p>
                <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var admin = await this.props.wallet.contractBinary.methods
                      .admin(this.state.wallet)
                      .call({ from: this.state.currentAccount });
                    
                    alert("this wallet is admin? "+this.state.wallet + ": "+admin);
                  }}
                >
                  is admin?
                </button>
              </p>
            </div>

            <div className="col l4 text-center">
              <input type="number" onChange={this.handleChangeCANTIDAD} placeholder="1000 USDT" />
              <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var user = await this.props.wallet.contractBinary.methods
                      .investors(this.state.wallet)
                      .call({ from: this.state.currentAccount });

                      user.invested = new BigNumber(user.invested).shiftedBy(-18).toString();
                    
                    alert("investmen of wallet: \n"+this.state.wallet+" \nis: \n$ "+ user.invested);
                  }}
                >
                  Check investment
                </button>
                </p>
              <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    this.props.wallet.contractBinary.methods
                      .updateBloke(this.state.wallet ,cantidad.toString(10), true)
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("investmen of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  add investment
                </button>
                </p>
              <p>
                <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async () => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    var transaccion =
                      await this.props.wallet.contractToken.methods
                        .transfer(
                          this.state.wallet,
                          cantidad.toString(10)
                        )
                        .send({ from: this.props.wallet.currentAccount });

                    alert("verifica la transaccion " + transaccion.transactionHash);
                    setTimeout(
                      window.open(
                        `https://bscscan.com/tx/${transaccion.transactionHash}`,
                        "_blank"
                      ),
                      3000
                    );
                    this.setState({ cantidad: 0 });
                  }}
                >
                  Send Token
                </button>
              </p>
              <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var user = await this.props.wallet.contractBinary.methods
                      .investors(this.state.wallet)
                      .call({ from: this.state.currentAccount });

                      user.blokesDirectos = new BigNumber(user.blokesDirectos).shiftedBy(-18).toString(10);
                    
                    alert("Range of wallet: \n"+this.state.wallet+" \nis: \n$ "+ user.blokesDirectos+"\nBLKS: "+ (user.blokesDirectos/50));
                  }}
                >
                  Check Range
                </button>
                </p>
                <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    console.log(this.props.wallet.web3)

                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);

                    this.props.wallet.contractBinary.methods
                      .asignarBlokePago2(this.state.wallet ,cantidad.toString(10), false)
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("Range of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  Deposit Bloks Payed
                </button>
                </p>
                
                <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    console.log(this.props.wallet.web3)

                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);

                    this.props.wallet.contractBinary.methods
                      .asignarBlokePago2(this.state.wallet ,cantidad.toString(10), true)
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("Range of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  Deposit Bloks infinity
                </button>
                </p>
                
              <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    console.log(this.props.wallet.web3)

                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);

                    this.props.wallet.contractBinary.methods
                      .updateBlokeRange(this.state.wallet ,cantidad.toString(10), true)
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("Range of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  add Bloks Range
                </button>
                </p>
            </div>

            <div className="col l4 text-center">
              <p>
                <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var transaccion = await this.props.wallet.contractBinary.methods
                      .makeNewAdmin(this.state.wallet)
                      .send({ from: this.state.currentAccount });
                    
                    alert("verifica la transaccion " + transaccion.transactionHash);
                    setTimeout(
                      window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                      3000
                    );
                  }}
                >
                  assign admin
                </button>
              </p>
              <p>
                <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    if(this.state.WitdrawlsC){
                      alert("you turn OFF witdrawls");
                    }else{
                      alert("you turn ON witdrawls");
                    }
                    var transaccion = await this.props.wallet.contractBinary.methods
                      .controlWitdrawl(!this.state.WitdrawlsC)
                      .send({ from: this.state.currentAccount });
                    
                    alert("transacction: "+transaccion.transactionHash);
                    setTimeout(
                      window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                      3000
                    );
                  }}
                >
                  Witdrawl: {""+this.state.WitdrawlsC}
                </button>
              </p>
              <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    this.props.wallet.contractBinary.methods
                      .addRoi(this.state.wallet, true, cantidad.toString(10))
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("ROI of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  add roi
                </button>
                </p>
                <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    this.props.wallet.contractBinary.methods
                      .addRoi(this.state.wallet, false, cantidad.toString(10))
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("ROI of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  Substrac roi
                </button>
                </p>
                <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    this.props.wallet.contractBinary.methods
                      .addInfinity(this.state.wallet, true, cantidad.toString(10))
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("Infinity of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  add Infinity
                </button>
                </p>
                <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    this.props.wallet.contractBinary.methods
                      .addInfinity(this.state.wallet, false, cantidad.toString(10))
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("Infinity of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  Substrac Infinity
                </button>
                </p>
                <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    this.props.wallet.contractBinary.methods
                      .addReferal(this.state.wallet, true, cantidad.toString(10))
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("Referal of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  add Referal
                </button>
                </p>
                <p>
              <button
                  type="button"
                  className="btn btn-info d-block text-center mx-auto mt-1"
                  onClick={async() => {
                    var cantidad = new BigNumber(this.state.cantidad).shiftedBy(18);
                    this.props.wallet.contractBinary.methods
                      .addReferal(this.state.wallet, false, cantidad.toString(10))
                      .send({ from: this.state.currentAccount })
                      .then(()=>{
                        alert("Referal of wallet:  \n"+this.state.wallet+"  \nis updated, please check");

                      })
                      .catch(()=>{
                        alert("Fail");

                      })
                    
                  }}
                >
                  Substrac Referal
                </button>
                </p>
            </div>
          </div>
          <hr></hr>
          <div className="row">

            {this.state.panelOwner}

          </div>
        </div>

      );
    } else {
      return <></>;
    }
  }
}
