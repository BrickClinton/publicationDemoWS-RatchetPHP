<?php
session_start();
require_once '../models/Person.php';
$person = new Person();

if (isset($_GET['op'])){

  //Personas
  function listDataPerson($data){

    if(count($data) <= 0){
      echo " ";
    }
    else{
      foreach($data as $row){


        echo "
          <tr>
            <td>
              <div class='text-right d-none' >
                <a data-idpersona='{$row['idpersona']}' class='btn btn-outline-info btn-sm modificarPerson' href='#'><i class='fas fa-edit'></i></a>  
              </div>
            </td>
          </tr>
          <tr>
            <td align='center'>
              <i class='fas fa-smile'></i>
            </td>
            <td id='no'>{$row['nombres']} {$row['apellidos']}</td>
          </tr>
          <tr>
            <td align='center'>
              <i class='fas fa-phone'></i>
            </td>
            <td id='te'>{$row['telefono']}</td>
          </tr>
          <tr>
            <td align='center'>
              <i class='fas fa-calendar-check'>
            </td>
            <td id='fe'>{$row['fechanac']}</td>
          </tr>
          
          <tr>
            <td align='center'>
              <i class='fas fa-map-marked-alt'></i>
            </td>
            <td id='ti'>{$row['tipocalle']} {$row['nombrecalle']} {$row['numerocalle']}</td>
          </tr>
          

          
        ";
      }
    }
  }

  // Obtener los datos de una persona
  if ($_GET['op'] == 'getAPerson'){
    $data = [];

    if($_GET['idpersonaactivo'] != -1){
      $data = $person->getAPerson(["idpersona" => $_GET['idpersonaactivo']]);
    } else {
      $data = $person->getAPerson(["idpersona" => $_SESSION['idpersona']]);
    }
    echo json_encode($data);
  }

  // Actualizar person
  if ($_GET['op'] == 'updatePerson'){
    $person->updatePerson([
      "idpersona"       =>  $_SESSION["idpersona"],
      "apellidos"       =>  $_GET["apellidos"],
      "nombres"         =>  $_GET["nombres"],
      "fechanac"        =>  $_GET["fechanac"],
      "telefono"        =>  $_GET["telefono"],
      "tipocalle"       =>  $_GET["tipocalle"],
      "nombrecalle"     =>  $_GET["nombrecalle"],
      "numerocalle"     =>  $_GET["numerocalle"],
      "pisodepa"        =>  $_GET["pisodepa"]
    ]);
  }

  // Obtener un registro
  if($_GET['op'] == 'getAPersonLogin'){
    $data = $person->getAPerson(["idpersona" => $_SESSION['idpersona']]);
    if($data){
      echo json_encode($data);
    }
  }
}


?>