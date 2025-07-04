# 3D BIM Models for roads must have the following property sets and parameters:

## PROPERTY SETS

- SIC_NS PROPIEDADES DE PROYECTO
- SIC_NS PROPIEDADES COORD
- SIC_NS PROPIEDADES EJE

## PARAMETERS 

### SIC_NS PROPIEDADES DE PROYECTO

- **SIC_NS_IdMacroUbicacion**: Macro Location ID. Defined by MOP and refers to the geographic location of the element.
- **FichaTecnica**: Path/Link to the folder with the last delivered version of the project documents (PID or As Built).
- **SIC_NS_IdTipoElemento**: Element Type ID. Defined by the concessionary. MOP must validate.
- **SIC_NS_IdElemento**: Element ID. Defined by MOP.
- **SIC_NS_LADO**: Side. Defined by the concessionary.
- **SIC_NS_Tramo**: Section ID. Defined by the concessionary.
- **SIC_NS_Via**: Road ID. Defined by the concessionary.
- **SIC-NS**: Service ID. Defined by MOP.

### SIC_NS PROPIEDADES COORD

- **SIC_NS_CoordFin**: Final Coordinate. Defined by the concessionary. May be empty for some elements.
- **SIC_NS_CoordIni**: Initial Coordinate. Defined by the concessionary.

### SIC_NS PROPIEDADES EJE

- **SIC_NS_DmFin**: Final Distance. Defined by the concessionary in km. May be empty for some elements.
- **SIC_NS_DmIni**: Initial Distance. Defined by the concessionary in km.

## CRS: Coordinate Reference System

All the values for the parameters **SIC_NS_CoordFin** and **SIC_NS_CoordIni** must be in the same CRS as the 3D Model. This is WGS84 with decimal degrees. For the X field values must be between -75.600000 and -66.400000. For the Y field values must be between -17.500000 and -55.900000. Coordinates must have 6 decimal places.


## Exporting the data
All the information from above property sets must be read by the Web Data Management System from the 3D Models in IFC format and exported to a XLSX file in order to upload the information to the SIC-NS system. This must be done automatically when the 3D Models are updated.

The XLSX File must have the following structure:

| Column | Description |
|--------|-------------|
|SIC_NS_IdMacroUbicacion| Macro Location ID, this is given by MOP |
|FichaTecnica| Path where the last delivery of the documents of the project are stored. |
|SIC_NS_IdTipoElemento| Element Type ID |
|SIC_NS_IdElemento| Element ID |
|SIC_NS_Lado| Side |
|SIC_NS_Tramo| Section ID |
|SIC_NS_Via| Road ID |
|SIC-NS| Road code |
|SIC_NS_CoordFin| Final Coordinate |
|SIC_NS_CoordIni| Initial Coordinate |
|SIC_NS_DmFin| Final Distance |
|SIC_NS_DmIni| Initial Distance |
Source: Manual Integración SICE - SIC-NS V2 2.0.1

# 3D Models and Management Platform

The management platform must be able to read IFC files and present them to the user in a 3D viewer. The must be presented initially with a map vision of the project defined by the macro zones in the model database. 

# Macro Zones (Macro Ubicaciones)

| Column | Description |
|--------|-------------|
| Id Macro Ubicacion | Macro Location ID, this is given by MOP |
| Id Tramo | Section ID |
| Codigo | Road code |
| Rol | Common name for road |
| Id Region | Region ID |
| Descripcion | Description |
| Referencia Inicio | Initial Reference |
| Referencia Final | Final Reference |    
| Id Contrato | Contract ID |
| Id Tipo Tramo | Section Type ID |
| Id Tramo Principal | Main Section ID |
| Id Lado Respecto Tramo Principal | Side with respect to Main Section ID |
| Id Tipo Tramo Principal | Main Section Type ID |
| Enlace Asociado | Associated Link |
| Georeferencia Inicio | Initial Georeference |
| Georeferencia Final | Final Georeference |
| Acción | Action |
Source: Manual Integración SICE - SIC-NS V2 2.0.1

