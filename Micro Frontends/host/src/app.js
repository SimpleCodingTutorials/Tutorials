const loadRemoteComponent = async() => {
  const {default: HelloWorld} = await import("remoteApp/HelloWorld");
  document.getElementById("remote-container").innerHTML = HelloWorld();
};

export default loadRemoteComponent;