(function () {
  const lat = 20.6738686;
  const lng = -103.3704326;
  const mapa = L.map("mapa").setView([lat, lng], 16);
  let marker;

  //Utilizar Provider y geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);
  //El pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  //decetcatar el movimineto del pin
  marker.on("moveend", function (e) {
    marker = e.target;

    const posicion = marker.getLatLng();
    console.log(posicion);
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    //Obtenber la infromacion de las calles
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, resultado) {
        console.log(resultado);
        marker.bindPopup(resultado.address.LongLabel);

        //Llenar los campos
        document.querySelector(".calle").textContent =
          resultado?.address?.Address ?? "";
        document.querySelector("#calle").value =
          resultado?.address?.Address ?? "";
        document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
        document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
      });
  });
})();
