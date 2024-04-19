import sequelize from "../libs/sequelize.js";

export const find = async (fechaInicio, fechaFin, sede) => {
  const orders = await sequelize.query(`
  select 
    to_char(fecha_inicio,'YYYY/MM/DD') as fecha, 
    e.name as sector,
    b.codigo_orden as codigo_orden, 
    f.name as brigada,
    a.zona as zona, 
    c.default_code as codigo_producto, 
    c.name as nombre_producto, 
    d.name as tipo_orden, 
    a.valor as valor 
  from hsg_orden_servicios_digitados a 
  inner join hsg_orden b on a.orden_id = b.id
  inner join product_template c on a.producto_id = c.id 
  inner join hsg_tipo_orden d on a.tipo_id = d.id 
  inner join hsg_sector e on b.sector_id = e.id  
  inner join hsg_brigadas f on b.brigada_id = f.id
  where 
    to_char(fecha_inicio,'YYYY/MM/DD')>='${fechaInicio}' and 
    to_char(fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' and 
    e.id = ${sede}
  order by fecha_inicio asc;
  `);

  return orders[0];
};

export const findSector = async () => {
  const sector = await sequelize.query(`
    select 
      id,
      name 
    from hsg_sector
  `);

  return sector;
};
