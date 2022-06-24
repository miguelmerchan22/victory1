import React, { Component } from "react";

import CrowdFunding from "../CrowdFunding";
import Oficina from "../Oficina";
import Datos from "../Datos";
import Depositos from "../Depositos";

export default class Home extends Component {

  render() {

      return (
        <> 
          <Oficina contractAddress={this.props.contractAddress} wallet={this.props.wallet} currentAccount={this.props.currentAccount}/>

          <CrowdFunding contractAddress={this.props.contractAddress}  wallet={this.props.wallet} currentAccount={this.props.currentAccount}/>

          <Datos admin={this.props.admin} contractAddress={this.props.contractAddress} wallet={this.props.wallet} currentAccount={this.props.currentAccount}/>

          <Depositos contractAddress={this.props.contractAddress} wallet={this.props.wallet} currentAccount={this.props.currentAccount}/>

        </>
      );
  }
}
