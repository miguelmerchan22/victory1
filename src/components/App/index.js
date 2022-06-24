import React, { Component } from "react";

import Web3 from "web3";

import Home from "../V1Home";
import TronLinkGuide from "../TronLinkGuide";
import cons from "../../cons"

import abiToken from "../../token";
import abiInfinity from "../../infinity-abi";

var chainId = cons.chainId;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: false,
      metamask: false,
      conectado: false,
      currentAccount: "0x0000000000000000000000000000000000000000",
      binanceM:{
        web3: null,
        contractToken: null,
        contractBinary: null
      }
      
    };

    this.isAdress = this.isAdress.bind(this);
    
  }

  async componentDidMount() {

      if (typeof window.ethereum !== 'undefined') {        
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId}],
        });       
        var resultado = await window.ethereum.request({ method: 'eth_requestAccounts' });
          //console.log(resultado[0]);
          this.setState({
            currentAccount: resultado[0],
            metamask: true,
            conectado: true
          })

      } else {          
        this.setState({
          metamask: false,
          conectado: false
        })      
      }

      setInterval(async() => {
        if (typeof window.ethereum !== 'undefined') {        
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId}],
          });       
          var resultado = await window.ethereum.request({ method: 'eth_requestAccounts' });
            //console.log(resultado[0]);
            this.setState({
              currentAccount: resultado[0],
              metamask: true,
              conectado: true
            })
  
        } else {          
          this.setState({
            metamask: false,
            conectado: false
          })      
        }

      },7*1000);


      try {         
        var web3 = new Web3(window.web3.currentProvider);// provider... metamask
        var contractToken = new web3.eth.Contract(
          abiToken,
          cons.TOKEN
        );
        var contractBinary = new web3.eth.Contract(
          abiInfinity,
          cons.INFINITY
  
        );
  
        var isAdmin = await contractBinary.methods.admin(this.state.currentAccount).call({from:this.state.currentAccount});
  
          this.setState({
            binanceM:{
              web3: web3,
              contractToken: contractToken,
              contractBinary: contractBinary
            },
            admin: isAdmin,
          })
  
        //web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"));
      } catch (error) {
          alert(error);
      } 


     

  }

  isAdress(wallet){

    if (!this.props.wallet.web3.utils.isAddress(wallet)) {
      this.props.wallet.contractBinary.methods
      .idToAddress(wallet)
      .call({ from: this.props.contractAddress })
      .then((address)=>{return address;})
      .catch(()=>{return wallet;})
    }

  }

  render() {

    if (!this.state.metamask) return (
      <>
        <div className="row">
          <TronLinkGuide />
        </div>
      </>
      );

    if (!this.state.conectado) return (
      <>
        <div className="row">
          <TronLinkGuide installed />
        </div>
      </>
      );

      var getString = "";
      var loc = document.location.href;
      var verWallet = cons.WS;
      //console.log(loc);
      if(loc.indexOf('?')>0){
                
        getString = loc.split('?')[1];
        getString = getString.split('#')[0];
        getString = getString.split('&')[0];

        verWallet = getString.split('=')[1];
        
        getString = getString.split('=')[0];

        console.log(getString)
  
      }
    
    switch (getString) {
      case "view":
        return(
          <div className="row">
            <Home admin={this.state.admin} contractAddress={cons.INFINITY} version="2" wallet={this.state.binanceM} currentAccount={verWallet}/>
          </div>
        );
      default:
        return(
          <div className="row">
            <Home admin={this.state.admin} contractAddress={cons.INFINITY} version="2" wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>
          </div>
        );
    }

      
  
  }
}
export default App;