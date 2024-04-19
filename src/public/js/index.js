import xlsx from "https://cdn.sheetjs.com/xlsx-0.20.2/package/xlsx.mjs";

const inputFechaInicio = document.getElementById("fecha_inicio");
const inputFechaFin = document.getElementById("fecha_fin");
const buttonDescargar = document.getElementById("descargar");

buttonDescargar.addEventListener("click", async (e) => {
  e.preventDefault();
  const inicio = new Date(inputFechaInicio.value);
  const fin = new Date(inputFechaFin.value);
  if (fin < inicio || fin == "Invalid Date" || inicio == "Invalid Date") {
    alert("Ojito");
  } else {
    fetch("/order", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servicio
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, `Blur`);
        xlsx.writeFile(workbook, "Blur.xlsx");
        console.log("Servicio ejecutado correctamente");
        console.log(data); // Acceder a los datos del servicio
      })
      .catch((error) => {
        console.error("Error al ejecutar el servicio:", error);
      });
  }
});
