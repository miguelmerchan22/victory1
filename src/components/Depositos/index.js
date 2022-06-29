import React, { Component } from "react";
const BigNumber = require('bignumber.js');


export default class Depositos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direccion: "",
      link: "Make an investment to get the referral LINK",
      registered: false,
      balanceRef: 0,
      totalRef: 0,
      invested: 0,
      paidAt: 0,
      my: 0,
      almacen: 0,
      withdrawn: 0,
      precioSITE: 1,
      valueSITE: 0,
      valueUSDT: 0,
      personasIzquierda: 0,
      puntosIzquierda: 0,
      personasDerecha: 0,
      puntosDerecha: 0,
      bonusBinario: 0,
      puntosEfectivosIzquierda: 0,
      puntosEfectivosDerecha: 0,
      puntosReclamadosIzquierda: 0,
      puntosReclamadosDerecha: 0,
      puntosLostIzquierda: 0,
      puntosLostDerecha: 0,
      directos: 0,
      depositosInfy: "",
      totalDepositos: 0,
      totalInfinity: 0,
      porcent: 210,

    };

    this.Investors = this.Investors.bind(this);
    this.Investors2 = this.Investors2.bind(this);
    this.Investors3 = this.Investors3.bind(this);
    this.Link = this.Link.bind(this);
    this.withdraw = this.withdraw.bind(this);

    this.rateSITE = this.rateSITE.bind(this);
    this.handleChangeSITE = this.handleChangeSITE.bind(this);
    this.handleChangeUSDT = this.handleChangeUSDT.bind(this);
  }

  handleChangeSITE(event) {
    this.setState({valueSITE: event.target.value});
  }

  handleChangeUSDT(event) {
    this.setState({valueUSDT: event.target.value});
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
      this.Investors2();
      this.Investors3();
      this.Investors();
      this.Link();
    },3*1000);
    
  };

  async rateSITE(){
    /*var proxyUrl = cons.proxy;
    var apiUrl = cons.PRE;
    var response;

    try {
      response = await fetch(proxyUrl+apiUrl);
    } catch (err) {
      console.log(err);
      return this.state.precioSITE;
    }

    var json = await response.json();

    this.setState({
      precioSITE: json.Data.precio
    });

    return json.Data.precio;*/

    return 1;

  };

  async Link() {
    const {registered} = this.state;
    if(registered){

      let loc = document.location.href;
      if(loc.indexOf('?')>0){
        loc = loc.split('?')[0];
      }

      if(loc.indexOf('#')>0){
        loc = loc.split('#')[0];
      }
      let mydireccion = this.state.currentAccount;
      mydireccion = await this.props.wallet.contractBinary.methods.addressToId(this.state.currentAccount).call({from:this.state.currentAccount});

      mydireccion = loc+'?ref='+mydireccion;
      var link = mydireccion+"&hand=izq";
      var link2 = mydireccion+"&hand=der";
      this.setState({
        link: link,
        link2: link2,
      });
    }else{
      this.setState({
        link: "Make an investment to get the referral LINK",
        link2: "Make an investmentnto get the referral LINK",
      });
    }
  }


  async Investors() {

    let usuario = await this.props.wallet.contractBinary.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});

    usuario.withdrawable = await this.props.wallet.contractBinary.methods.withdrawable(this.state.currentAccount, false).call({from:this.state.currentAccount});
    
    var decimales = await this.props.wallet.contractToken.methods.decimals().call({from:this.state.currentAccount});

    var verdepositos = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount, false).call({from:this.state.currentAccount});

    usuario.inicio = 1000;

    var listaDepositos = (
      <div className="box">
        <h3 className="title">There is not yet deposits.</h3>

      </div>
    );

    if (verdepositos[0].length > 0) {
      var depositos = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount, false).call({from:this.state.currentAccount});

      depositos.amount =  depositos[0];
      depositos.tiempo =  depositos[1];
      depositos.activo =  depositos[3];

      listaDepositos = [];

      var tiempo = await this.props.wallet.contractBinary.methods.tiempo().call({from:this.state.currentAccount});

      tiempo = tiempo*1000;

      let porcent = await this.props.wallet.contractBinary.methods.porcent().call({from:this.state.currentAccount});

        porcent = porcent/100;

      for (let i = 0; i < depositos.amount.length; i++) {

        var porcentiempo = (((Date.now()-(depositos.tiempo[i]*1000)))*100)/tiempo;

        if(porcentiempo >= 100)porcentiempo = 100;
        
        var fecha = new Date((depositos.tiempo[i]*1000)+tiempo)+"";

        var temp = new BigNumber(depositos.amount[i]).shiftedBy(-18).toNumber();

        var proceso;
        if (depositos.activo[i]  && (temp*(porcentiempo/100)) < (temp) ){
            proceso = <b> (ACTIVE)</b> 
        }else{
          proceso = <b> (FINALIZED)</b> 
        }
        
        listaDepositos[depositos.amount.length-i] = (
          <div className="col s12 m12 l12" key={"depsits-"+i}>
            <div id="basic-demo" className="card card-tabs">
                <div className="card-content">
                    <div className="card-title">
                        <div className="row">
                            <div className="col s12 m6 l10">
                                <h4 className="card-title"><b>{((temp)/porcent)/50}</b> BLKS ($ {((temp)/porcent)})|  <meter min="0" max="100"
         low="25" high="75"
         optimum="100" value={porcentiempo} /> {porcentiempo.toFixed(6)}% | {proceso}</h4>
                            </div>
                        </div>
                    </div>
                    <div id="view-basic-demo">
                        <div className="row">
                            <div className="col s12">
                              
                              <p><b>Time to end: </b>{fecha} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>         
    
    
        </div>
        );
        
      }
    }


    this.setState({
      registered: usuario.registered,
      balanceRef: usuario.balanceRef/10**decimales,
      totalRef: usuario.totalRef/10**decimales,
      invested: usuario.invested/10**decimales,
      paidAt: usuario.paidAt/10**decimales,
      my: usuario.withdrawable/10**decimales,
      withdrawn: usuario.withdrawn/10**decimales,
      almacen: usuario.almacen/10**decimales,
      porcentiempo: porcentiempo,
      directos: usuario.directos,
      depositos: listaDepositos,
      arrayDepositos: depositos,
    });

  };

  async Investors2() {

    let usuario = await this.props.wallet.contractBinary.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});

    usuario.withdrawable = await this.props.wallet.contractBinary.methods.withdrawable(this.state.currentAccount, false).call({from:this.state.currentAccount});
    
    var verdepositos = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount, true).call({from:this.state.currentAccount});

    usuario.inicio = 1000;

    var listaDepositos = (
      <>

      </>
    );

    if (verdepositos[0].length > 0) {
      var depositos = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount, true).call({from:this.state.currentAccount});
      depositos.amount =  depositos[0];
      delete depositos[0];
      depositos.tiempo =  depositos[1];
      delete depositos[1];
      depositos.pasivo =  depositos[2];
      delete depositos[2];
      depositos.activo =  depositos[3];
      delete depositos[3];

      //console.log(depositos);

      listaDepositos = [];

      var tiempo = await this.props.wallet.contractBinary.methods.tiempo().call({from:this.state.currentAccount});

      tiempo = tiempo*1000;

      for (let i = 0; i < depositos.amount.length; i++) {

        var porcentiempo = (((Date.now()-(depositos.tiempo[i]*1000)))*100)/tiempo;

        //console.log(porcentiempo)

        if(porcentiempo >= 100){
          porcentiempo = 100;
        }

        if(porcentiempo < 0){
          porcentiempo = 0;
        }

        var fecha = new Date((depositos.tiempo[i]*1000)+tiempo)+"";

        var proceso = <b> (FINALIZED)</b> ;
        if (depositos.activo[i]  && porcentiempo <= 100) {
          proceso = <b> (ACTIVE)</b> 
        }
         
        var temp = new BigNumber(depositos.amount[i]).shiftedBy(-18).toNumber();

        listaDepositos[depositos.amount.length-i] = (
          <div className="col s12 m12 l12" key={"depsits-"+i}>
            <div id="basic-demo" className="card card-tabs">
                <div className="card-content">
                    <div className="card-title">
                        <div className="row">
                            <div className="col s12 m6 l10">
                                <h4 className="card-title"><b>+ {temp}</b> USD | Infinity |  
                                  <meter min="0" max="100" low="25" high="75" optimum="100" value={porcentiempo} /> 
                                  {porcentiempo.toFixed(6)}% | {proceso}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div id="view-basic-demo">
                        <div className="row">
                            <div className="col s12">
                              
                              <p><b>Time to end: </b>{fecha} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
        </div>
        );
        
      }
    }


    this.setState({

      depositosInfy: listaDepositos,
      arrayDepositosInfy: depositos
    });


  };

  async Investors3() {

    var depositosInfy = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount, true).call({from:this.state.currentAccount});
    var depositos = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount, false).call({from:this.state.currentAccount});

    let porcent = await this.props.wallet.contractBinary.methods.porcent().call({from:this.state.currentAccount});
    porcent = porcent/100;

    if (depositosInfy === undefined)depositosInfy = [];
    if (depositos === undefined)depositos = [];

    var totalDepositos = 0;
    var totalInfinity = 0;

    for (let index = 0; index < depositos[0].length; index++) {
      totalDepositos += (new BigNumber(depositos[0][index]).shiftedBy(-18).toNumber())/porcent;

    }
    for (let index = 0; index < depositosInfy[0].length; index++) {
      totalInfinity += new BigNumber(depositosInfy[0][index]).shiftedBy(-18).toNumber();

    }

    this.setState({
      totalDepositos,
      totalInfinity,
      porcent,
    })

  };

  async withdraw(){
    const { balanceRef, my, almacen, directos, valorPlan, bonusBinario } = this.state;

    var available = (balanceRef+my+almacen);
    if(directos >= 2 && available < valorPlan){
      available += bonusBinario;
    }
    available = available.toFixed(8);
    available = parseFloat(available);

    var decimales = await this.props.wallet.contractToken.methods.decimals().call({from:this.state.currentAccount});

    var MIN_RETIRO = await this.props.wallet.contractBinary.methods.MIN_RETIRO().call({from:this.state.currentAccount});

    MIN_RETIRO = MIN_RETIRO/10**decimales;

    if ( available > MIN_RETIRO ){
      await this.props.wallet.contractBinary.methods.withdrawToDeposit().send({from:this.state.currentAccount});
      await this.props.wallet.contractBinary.methods.withdraw().send({from:this.state.currentAccount});
    }else{
      if (available < MIN_RETIRO) {
        window.alert("The minimum to withdraw are: "+(MIN_RETIRO)+" USDT");
      }
    }
  };


  render() {   

    return (
      <>
        <div className="row center-align">
        <div className="col s12 m12 l12">
          <h3>Final Profit: $ {(this.state.totalDepositos*this.state.porcent)+this.state.totalInfinity}</h3>
          <h3>Total Deposits: $ {this.state.totalInfinity+this.state.totalDepositos}</h3>
        </div>
          <div className="col s6 m6 l6">
            <h4>Deposits: $ {this.state.totalDepositos}</h4>
          </div>
          <div className="col s6 m6 l6">
            <h4>Infinity Deposits: $ {this.state.totalInfinity}</h4>
          </div>
        </div>
        <div className="row">

                {this.state.depositos}
            

                {this.state.depositosInfy}

        </div>
      </>
    );
  }
}
