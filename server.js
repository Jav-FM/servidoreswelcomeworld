const http = require("http");
const url = require("url");
const fs = require("fs");

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = "0" + dd;
}
if (mm < 10) {
  mm = "0" + mm;
}
today = dd + "/" + mm + "/" + yyyy;

//PUNTO 9: En Eliminar, debo lograr indicar un texto primero y el otro despues de que pase un tiempo
http
  .createServer((req, res) => {
    const params = url.parse(req.url, true).query;

    if (req.url.includes("/crear")) {
      const { nombre, contenido } = params;
      return fs.writeFile(
        `./archivos/${nombre}`,
        `
        ${today}

        ${contenido}
        `,
        "utf8",
        (err) => {
          if (err) {
            return res.end("No se pudo crear el archivo", null);
          } else {
            return res.end(`El archivo fue creado`, null);
          }
        }
      );
    }

    if (req.url.includes("/leer")) {
      const { nombre } = params;
      return fs.readFile(`./archivos/${nombre}`, (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        if (err) {
          return res.end("No se pudo leer el archivo", null);
        } else {
          return res.end(`Archivo leido, contenido: ${data}`, null);
        }
      });
    }

    if (req.url.includes("/renombrar")) {
      const { nombre, nuevoNombre } = params;
      return fs.rename(
        `./archivos/${nombre}`,
        `./archivos/${nuevoNombre}`,
        (err) => {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          if (err) {
            return res.end("No se pudo renombrar el archivo", null);
          } else {
            return res.end(
              `Archivo ${nombre} renombrado como ${nuevoNombre}`,
              null
            );
          }
        }
      );
    }

    if (req.url.includes("/eliminar")) {
      const { nombre } = params;
      fs.unlink(`./archivos/${nombre}`, (err) => {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write(`Tu solicitud para eliminar el archivo ${nombre} se está
        procesando... `);
        setTimeout(() => {}, 3000);
        if (err) {
          setTimeout(() => {
            res.write("<br> No se pudo eliminar el archivo", null);
            res.end();
          }, 3000);
        } else {
          setTimeout(() => {
            res.write("<br>"+`El archivo ${nombre} fue eliminado con éxito`, null);
            res.end();
          }, 3000);
        }
      });
    }

    if (req.url.includes("/listar")) {
      fs.readdir(`./archivos`, (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        if (err) {
          return res.end("No se pudo generar lista", null);
        } else {
          data.forEach((a) => res.write(`${a} <br>`));
          res.end();
        }
      });
    }
  })
  .listen(8080, () => {
    console.log("Server ON");
  });
