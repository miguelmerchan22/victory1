const proxy = "https://proxy-sites.herokuapp.com/";

const WS = "0x0000000000000000000000000000000000000000";//0x0000000000000000000000000000000000000000 recibe los huerfanos por defecto

var INFINITY = "0xf9B921b48B35b21b9aEeC5Ddfc16DCe91C0f16EF"; // version 2

var TOKEN = "0x55d398326f99059fF775485246999027B3197955";
var chainId = '0x38';

if(true){// testnet comand
    INFINITY = "0xeBbFeAc198B7bA39282fb3975051c32054F294Ae"; // version 2  0xf47fBd34E663D8F5ad78fbf46Ae097202557A8e8

    TOKEN = "0xd5881b890b443be0c609BDFAdE3D8cE886cF9BAc";
    chainId = '0x61';// BTTChain "0xC7"//;
}

export default {proxy, WS,INFINITY, TOKEN, chainId};
