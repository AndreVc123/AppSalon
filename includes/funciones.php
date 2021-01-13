<?php

function obtenerServicios () : array {
    try {

        //Importar una conexión 
        require 'databases.php';
        
        //Escribir codigo sql
        $sql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db, $sql);

        //Arreglo vacio
        $servicios = [];

        $i = 0;

        //Obtener los resultados
        while ($row = mysqli_fetch_assoc($consulta)) {
            $servicios[$i]['id'] = $row['idServicio'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];

            $i++;
        } 

        return $servicios;

    } catch (\Throwable $th) {
        var_dump($th);
    }
}
