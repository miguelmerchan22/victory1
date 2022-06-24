pragma solidity >=0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface TRC20_Interface {

    function allowance(address _owner, address _spender) external view returns (uint remaining);
    function transferFrom(address _from, address _to, uint _value) external returns (bool);
    function transfer(address direccion, uint cantidad) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
    function decimals() external view returns(uint);
}

library SafeMath {

    function mul(uint a, uint b) internal pure returns (uint) {
        if (a == 0) {
            return 0;
        }

        uint c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint a, uint b) internal pure returns (uint) {
        require(b > 0);
        uint c = a / b;

        return c;
    }

    function sub(uint a, uint b) internal pure returns (uint) {
        require(b <= a);
        uint c = a - b;

        return c;
    }

    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a);

        return c;
    }

}

contract Context {

  constructor () { }

  function _msgSender() internal view returns (address payable) {
    return payable(msg.sender);
  }

  function _msgData() internal view returns (bytes memory) {
    this; 
    return msg.data;
  }
}

contract Ownable is Context {
  address payable public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  constructor(){
    owner = payable(_msgSender());
  }
  modifier onlyOwner() {
    if(_msgSender() != owner)revert();
    _;
  }
  function transferOwnership(address payable newOwner) public onlyOwner {
    if(newOwner == address(0))revert();
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract Admin is Context, Ownable{
  mapping (address => bool) public admin;

  event NewAdmin(address indexed admin);
  event AdminRemoved(address indexed admin);

  constructor(){
    admin[_msgSender()] = true;
  }

  modifier onlyAdmin() {
    if(!admin[_msgSender()])revert();
    _;
  }

  function makeNewAdmin(address payable _newadmin) public onlyAdmin {
    if(_newadmin == address(0))revert();
    emit NewAdmin(_newadmin);
    admin[_newadmin] = true;
  }

  function makeRemoveAdmin(address payable _oldadmin) public onlyOwner {
    if(_oldadmin == address(0))revert();
    emit AdminRemoved(_oldadmin);
    admin[_oldadmin] = false;
  }

}

contract UnilevelSystem is Context, Admin{
  using SafeMath for uint256;

  address token = 0x55d398326f99059fF775485246999027B3197955;

  TRC20_Interface USDT_Contract = TRC20_Interface(token);

  struct Deposito {
    uint256 inicio;
    uint256 value;
    uint256 amount;
    bool infinity;
  }

  struct Investor {
    bool registered;
    uint256 membership;
    uint256 balanceRef;
    uint256 totalRef;
    uint256 invested;
    uint256 paidAt;
    uint256 paidAt2;
    uint256 withdrawn;
    uint256 directos;
    string data;
    Deposito[] depositos;
    uint256 blokesDirectos;
  }

  uint256 public MIN_RETIRO = 15 * 10**18;

  uint256 public PRECIO_BLOCK = 50 * 10**18;

  address public tokenPricipal = token;

  uint256 public inversiones = 1;
  uint256[] public primervez = [50, 30, 20, 10, 10];
  uint256[] public porcientos = [15, 9, 6, 3, 3];
  uint256[] public infinity = [5, 3, 2, 1, 1];

  bool[] public baserange = [false,false,false,false,false,false,false,false];
  uint256[] public gananciasRango = [750*10**18, 1500*10**18, 3750*10**18, 7500*10**18, 15000*10**18, 50000*10**18, 150000*10**18, 250000*10**18];
  uint256[] public puntosRango = [1000, 2000, 5000, 10000, 20000, 100000, 300000, 500000];

  bool public onOffWitdrawl = true;

  uint256 public duracionMembership = 365;
  uint256 public dias = 900;

  uint256 public unidades = 86400;

  uint256 public porcent = 240;

  uint256 public descuento = 100;
  uint256 public personas = 2;

  uint256 public totalInvestors = 1;
  uint256 public totalInvested;
  uint256 public totalRefRewards;
  
  uint256 public totalRoiWitdrawl;
  uint256 public totalRefWitdrawl;
  uint256 public totalTeamWitdrawl;

  mapping (address => Investor) public investors;

  mapping (address => address) public padre;
  mapping (address => address[]) public hijo;

  mapping (uint256 => address) public idToAddress;
  mapping (address => uint256) public addressToId;

  mapping (address => bool[]) public rangoReclamado;

  mapping (uint256 => uint256) public blockesRango;
  mapping (uint256 => uint256) public usdtRetirado;
  
  uint256 public lastUserId = 1;

  address[] public walletFee = [0x4490566647735e8cBCe0ce96efc8FB91c164859b,0xd0f2fCDf7d399205E9709C6D0fBeE434335e42DD];
  uint256[] public valorFee = [5,95];
  uint256 public precioRegistro = 30 * 10**18;
  uint256 public activerFee = 2;
  // 0 desactivada total |  | 2 activa fee registro y paga porcentajes

  address[] public wallet = [0x17a7e5b2D9b5D191f7307e990e630C9DC18E1396,0xAFE9d039eC7D4409b1b8c2F1556f20843079B728,0x8DD59f5670e9809c8a800A49d1Ff1CEA471c53Da];
  uint256[] public valor = [70, 8, 5];

  constructor() {

    Investor storage usuario = investors[owner];

    usuario.registered = true;
    usuario.membership = block.timestamp + duracionMembership*unidades*1000000000000000000;

    rangoReclamado[_msgSender()] = baserange;

    idToAddress[0] = _msgSender();
    addressToId[_msgSender()] = 0;

  }

  function setInversiones(uint256 _numerodeinverionessinganancia) public onlyOwner returns(uint256){
    inversiones = _numerodeinverionessinganancia;
    return _numerodeinverionessinganancia;
  }

  function setPrecioRegistro(uint256 _precio) public onlyOwner returns(bool){
    precioRegistro = _precio;
    return true;
  }

  function setduracionMembership(uint256 _duracionMembership) public onlyOwner returns(bool){
    duracionMembership = _duracionMembership;
    return true;
  }

  function setDescuento(uint256 _descuento) public onlyOwner returns(bool){
    descuento = _descuento;
    return true;
  }

  function setWalletstransfers(address[] memory _wallets, uint256[] memory _valores) public onlyOwner returns(bool){

    wallet = _wallets;
    valor = _valores;

    return true;

  }

  function setWalletFee(address[] memory _wallet, uint256[] memory _fee , uint256 _activerFee ) public onlyOwner returns(bool){
    walletFee = _wallet;
    valorFee = _fee;
    activerFee = _activerFee;
    return true;
  }

  function setRangos(bool[] memory _baserange ,uint256[] memory _gananciasRango , uint256[] memory _puntosRango ) public onlyOwner returns(bool){
    baserange = _baserange;
    gananciasRango = _gananciasRango;
    puntosRango = _puntosRango;

    rangoReclamado[_msgSender()] = baserange;
    return true;
  }

  function baserangelength() public view returns(uint256){
    return baserange.length;
  }

  function setMIN_RETIRO(uint256 _min) public onlyOwner returns(uint256){

    MIN_RETIRO = _min;

    return _min;

  }

  function ChangeTokenPrincipal(address _tokenTRC20) public onlyOwner returns (bool){

    USDT_Contract = TRC20_Interface(_tokenTRC20);

    tokenPricipal = _tokenTRC20;

    return true;

  }
  
  function tiempo() public view returns (uint256){
     return dias.mul(unidades);
  }

  function setPorcientos(uint256 _nivel, uint256 _value) public onlyOwner returns(uint256[] memory){

    porcientos[_nivel] = _value;

    return porcientos;

  }

  function setPorcientosSalida(uint256 _nivel, uint256 _value) public onlyOwner returns(uint256[] memory){

    infinity[_nivel] = _value;

    return infinity;

  }

  function setPrimeravezPorcientos(uint256 _nivel, uint256 _value) public onlyOwner returns(uint256[] memory){

    primervez[_nivel] = _value;

    return primervez;

  }

  function setPriceBlock(uint256 _value) public onlyOwner returns(bool){
    PRECIO_BLOCK = _value;
    return true;
  }

  function setTiempo(uint256 _dias) public onlyAdmin returns(uint256){

    dias = _dias;
    
    return (_dias);

  }

  function setTiempoUnidades(uint256 _unidades) public onlyOwner returns(uint256){

    unidades = _unidades;
    
    return (_unidades);

  }

  function controlWitdrawl(bool _true_false) public onlyAdmin returns(bool){

    onOffWitdrawl = _true_false;
    
    return (_true_false);

  }

  function setRetorno(uint256 _porcentaje) public onlyAdmin returns(uint256){

    porcent = _porcentaje;

    return (porcent);

  }

  function column(address yo, uint256 _largo) public view returns(address[ ] memory) {

    address[] memory res;
    for (uint256 i = 0; i < _largo; i++) {
      res = actualizarNetwork(res);
      res[i] = padre[yo];
      yo = padre[yo];
    }
    
    return res;
  }

  function columnHijos(address yo) public view returns(address[] memory) {

    address[] memory res;
    for (uint256 i = 0; i < hijo[yo].length; i++) {
      res = actualizarNetwork(res);
      res[i] = hijo[yo][i];
    }
    
    return res;
  }

  function depositos(address _user, bool _infinity) public view returns(uint256[] memory, uint256[] memory, bool[] memory, uint256 ){
    Investor storage usuario = investors[_user];
    Deposito storage dep;

    uint256[] memory amount;
    uint256[] memory time;
    bool[] memory activo;
    uint256 total;
    uint finish;
    uint since;
    uint till;
    
    for (uint i = 0; i < usuario.depositos.length; i++) {
      dep = usuario.depositos[i];
      if(dep.infinity == _infinity){

        amount = actualizarArrayUint256(amount);
        time = actualizarArrayUint256(time);
        activo = actualizarArrayBool(activo);

        time[time.length-1] = dep.inicio;
        finish = dep.inicio + tiempo();

        till = block.timestamp > finish ? finish : block.timestamp;
        
        if (dep.infinity) {
          
          since = usuario.paidAt2 > dep.inicio ? usuario.paidAt2 : dep.inicio;

        }else{
          
          since = usuario.paidAt > dep.inicio ? usuario.paidAt : dep.inicio;
          
        }    

        if (since != 0 && since < till ) {

          total += dep.amount * (till - since) / tiempo() ;
          activo[activo.length-1] = true;
        } 

        amount[amount.length-1] = dep.amount;    
      } 

    }

    return (amount, time, activo, total);

  }

  function rewardReferers(address yo, uint256 amount, uint256[] memory array) internal {

    address[] memory referi;
    referi = column(yo, array.length);
    uint256 a;
    uint256 b;
    Investor storage usuario;

    for (uint256 i = 0; i < array.length; i++) {

      if (array[i] != 0) {
        usuario = investors[referi[i]];
        if (usuario.registered && usuario.membership >= block.timestamp ){
          if ( referi[i] != address(0) ) {

            a = amount.mul(array[i]).div(1000);
            b = amount.mul(porcientos[i]).div(100);

            usuario.balanceRef += a;
            usuario.totalRef += a;
            usuario.depositos.push(Deposito(block.timestamp,b,b, true));

            totalRefRewards += a;
            

          }else{
            break;
          }
        }
        
      } else {
        break;
      }
      
    }
  }

  function totalRange() public view returns (uint256){

    uint256 cantidad;

    for (uint256 a = 0; a < lastUserId; a++) {


      for (uint256 index = 0; index < gananciasRango.length; index++) {

        if(blockesRango[a] >= puntosRango[index] ){

          cantidad += gananciasRango[index];

        }
        
      }

    }

    return cantidad;

  }

  function totalRangeWitdrawl() public view returns (uint256){

    uint256 cantidad;

    for (uint256 a = 0; a < lastUserId; a++) {

      cantidad += usdtRetirado[a];

    }

    return cantidad;

  }

  function asignarBloke(address _user ,uint256 _bloks, bool _infinity) public onlyAdmin returns (bool){
    if(_bloks <= 0)revert("cantidad minima de blokes es 1");

    Investor storage usuario = investors[_user];

    if(!usuario.registered)revert();

    uint256 _value = PRECIO_BLOCK*_bloks;

    usuario.depositos.push(Deposito(block.timestamp, (_value.mul(porcent)).div(100), (_value.mul(porcent)).div(100), _infinity));

    return true;
  }

  function asignarBlokePago(address _user ,uint256 _bloks) public onlyOwner returns (bool){
    if(_bloks <= 0)revert("cantidad minima de blokes es 1");

    Investor storage usuario = investors[_user];

    if(!usuario.registered)revert();

    uint256 _value = PRECIO_BLOCK*_bloks;

    if (padre[_user] != address(0) ){

      rewardReferers(_user, _value, primervez);
        
      Investor storage sponsor = investors[padre[_user]];

      sponsor.blokesDirectos += _bloks;

      blockesRango[addressToId[padre[_user]]] += _bloks;
    }

    usuario.depositos.push(Deposito(block.timestamp,(_value.mul(porcent)).div(100),(_value.mul(porcent)).div(100), false));
    usuario.invested += _bloks;

    totalInvested += _value;

    return true;
  }

  function asignarMembership(address _user, address _sponsor) public onlyAdmin returns (bool){

    if (_sponsor == address(0) )revert();

    Investor storage usuario = investors[_user];

    if(!usuario.registered){
        usuario.registered = true;
        usuario.membership = block.timestamp + duracionMembership*unidades;
        padre[_user] = _sponsor;
      
        Investor storage sponsor = investors[_sponsor];
        sponsor.directos++;

        hijo[_sponsor].push(_user);
        
        totalInvestors++;

        rangoReclamado[_user] = baserange;
        idToAddress[lastUserId] = _user;
        addressToId[_user] = lastUserId;
        
        lastUserId++;
      }else{
        usuario.membership = usuario.membership + duracionMembership*unidades;
      }
        
      return true;
  }

  function registro(address _sponsor, string memory _datos) public{

    Investor storage usuario = investors[_msgSender()];

    if(_sponsor == address(0))revert("debes tener referido para registrarte");
    
    if(precioRegistro > 0){

      if( USDT_Contract.allowance(_msgSender(), address(this)) < precioRegistro)revert();
      if( !USDT_Contract.transferFrom(_msgSender(), address(this), precioRegistro))revert();

    }

    if (activerFee >= 2){
       for (uint256 i = 0; i < walletFee.length; i++) {
        USDT_Contract.transfer(walletFee[i], precioRegistro.mul(valorFee[i]).div(100));
      }
    }
      if(!usuario.registered){
        usuario.registered = true;
        usuario.membership = block.timestamp + duracionMembership*unidades;
        padre[_msgSender()] = _sponsor;

        Investor storage sponsor = investors[_sponsor];
        sponsor.directos++;

        hijo[_sponsor].push(_msgSender());

        
        totalInvestors++;

        rangoReclamado[_msgSender()] = baserange;
        idToAddress[lastUserId] = _msgSender();
        addressToId[_msgSender()] = lastUserId;
        
        lastUserId++;
      }else{
        usuario.membership = usuario.membership + duracionMembership*unidades;
      }
        
        usuario.data = _datos;

  }

  function updateData(string memory _datos) public{
    
    Investor storage usuario = investors[_msgSender()];

    usuario.data = _datos;

  }

  function buyBlocks(uint256 _bloks) public {

    if(_bloks <= 0)revert("cantidad minima de blokes es 1");

    Investor storage usuario = investors[_msgSender()];
    

    if (!usuario.registered)revert("no esta registrado");

    if (block.timestamp >= usuario.membership )revert("no tiene membership");

      uint256 _value = PRECIO_BLOCK*_bloks;

      if( USDT_Contract.allowance(_msgSender(), address(this)) < _value)revert("saldo aprovado insuficiente");
      if( !USDT_Contract.transferFrom(_msgSender(), address(this), _value) )revert("tranferencia fallida");
      
      if (padre[_msgSender()] != address(0) ){

        rewardReferers(_msgSender(), _value, primervez);
          
        Investor storage sponsor = investors[padre[_msgSender()]];

        sponsor.blokesDirectos += _bloks;

        blockesRango[addressToId[padre[_msgSender()]]] += _bloks;

      }

      usuario.depositos.push(Deposito(block.timestamp,(_value.mul(porcent)).div(100),(_value.mul(porcent)).div(100), false));
      usuario.invested += _bloks;

      
      totalInvested += _value;

      for (uint256 i = 0; i < wallet.length; i++) {
        USDT_Contract.transfer(wallet[i], _value.mul(valor[i]).div(100));
      }

    
  }

   function withdrawableRange(address any_user) public view returns (uint256 amount) {
    Investor memory user = investors[any_user];

    for (uint256 index = 0; index < gananciasRango.length; index++) {

      if(user.blokesDirectos >= puntosRango[index] && !rangoReclamado[_msgSender()][index]){

       amount = gananciasRango[index];
        
      }
      
    }
  
  
  }

  function newRecompensa() public {

    uint256 amount = withdrawableRange(_msgSender());

    if ( amount <= 0 )revert();

    Investor memory user = investors[_msgSender()];

    for (uint256 index = 0; index < gananciasRango.length; index++) {

      if(user.blokesDirectos >= puntosRango[index] && !rangoReclamado[_msgSender()][index]){

        USDT_Contract.transfer(_msgSender(), gananciasRango[index]);
        rangoReclamado[_msgSender()][index] = true;

        usdtRetirado[addressToId[_msgSender()]] += gananciasRango[index];

      }
      
    }

  }

  function actualizarNetwork(address[] memory oldNetwork)public pure returns ( address[] memory) {
    address[] memory newNetwork =   new address[](oldNetwork.length+1);

    for(uint i = 0; i < oldNetwork.length; i++){
        newNetwork[i] = oldNetwork[i];
    }
    
    return newNetwork;
  }

  function actualizarArrayBool(bool[] memory old)public pure returns ( bool[] memory) {
    bool[] memory newA =   new bool[](old.length+1);

    for(uint i = 0; i < old.length; i++){
        newA[i] = old[i];
    }
    
    return newA;
  }

  function actualizarArrayUint256(uint256[] memory old)public pure returns ( uint256[] memory) {
    uint256[] memory newA =   new uint256[](old.length+1);

    for(uint i = 0; i < old.length; i++){
        newA[i] = old[i];
    }
    
    return newA;
  }

  function allnetwork( address[] memory network ) public view returns ( address[] memory) {

    Investor storage user;

    for (uint i = 0; i < network.length; i++) {

      user = investors[network[i]];
      
      address userLeft = address(0);

      for (uint u = 0; u < network.length; u++) {
        if (userLeft == network[u]){
          userLeft = address(0);
        }
      }

      if( userLeft != address(0) ){
        network = actualizarNetwork(network);
        network[network.length-1] = userLeft;
      }

    }

    return network;
  }


  function withdrawable(address any_user, bool _infinity) public view returns (uint256) {

    uint256[] memory amount;
    uint256[] memory time;
    bool[] memory activo;
    uint256 total;

    (amount, time, activo, total) = depositos(any_user, _infinity);

    return total;


  }


  function withdraw() public {

    if (!onOffWitdrawl)revert();

    Investor storage usuario = investors[_msgSender()];

    uint256 _value = withdrawable(_msgSender(), false);

    if( USDT_Contract.balanceOf(address(this)) < _value )revert();
    if( _value < MIN_RETIRO )revert();

    USDT_Contract.transfer(_msgSender(), _value.mul(descuento).div(100));
  
    usuario.withdrawn += _value;
    usuario.paidAt = block.timestamp;

    totalRoiWitdrawl += _value;

  }

  function withdraw2() public {

    if (!onOffWitdrawl)revert();

    Investor storage usuario = investors[_msgSender()];

    uint256 _value = withdrawable(_msgSender(), true);

    if( USDT_Contract.balanceOf(address(this)) < _value )revert();
    if( _value < MIN_RETIRO )revert();

    USDT_Contract.transfer(_msgSender(), _value.mul(descuento).div(100));

    usuario.withdrawn += _value;
    usuario.paidAt2 = block.timestamp;

    totalRefWitdrawl += _value;

  }

   function withdrawTeam() public {

    Investor storage usuario = investors[_msgSender()];

    uint256 _value = usuario.balanceRef;

    if( USDT_Contract.balanceOf(address(this)) < _value )revert("no hay saldo en el contrato para hacer el pago");
    if( _value < MIN_RETIRO )revert();

    USDT_Contract.transfer(_msgSender(), _value.mul(descuento).div(100));

    delete usuario.balanceRef;

    totalTeamWitdrawl += _value;


   }

  function redimTokenPrincipal02(uint256 _value) public onlyOwner returns (uint256) {

    if ( USDT_Contract.balanceOf(address(this)) < _value)revert();

    USDT_Contract.transfer(owner, _value);

    return _value;

  }

  function redimBNB() public onlyOwner returns (uint256){

    owner.transfer(address(this).balance);

    return address(this).balance;

  }

  fallback() external payable {}
  receive() external payable {}

}