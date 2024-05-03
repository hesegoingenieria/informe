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

export const findByConsumer = async (fechaInicio, fechaFin, sede) => {
  /* const ordersSeriado = await sequelize.query(`
  select 
    to_char(b.fecha_inicio, 'DD/MM/YYYY'),
    b.cod_cuenta,
    b.codigo_orden,
    c.default_code,
    d.name,
    a.numero_serie,
    a.cantidad,
    b.serie_medidor,
    b.sector_id 
  from  hsg_orden_seriados a  
  inner join hsg_orden b on a.orden_id = b.id 
  inner join product_product c on a.producto_id = c.id 
  inner join product_template d on c.product_tmpl_id = d.id
  where 
    to_char(b.fecha_inicio,'YYYY/MM/DD')>='${fechaInicio}' and
    to_char(b.fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' and 
    b.sector_id = 10 and
    c.default_code not in ('16134', '16135')
  `); */
  const ordersSeriado = await sequelize.query(`
  SELECT 
    to_char(b.fecha_inicio, 'DD/MM/YYYY'),
    CASE WHEN 
      subconsulta.numero_serie IS NULL 
      THEN b.codigo_orden 
      ELSE subconsulta.numero_serie
      END as documento,
      b.cod_cuenta as id,
      b.codigo_orden as num_ot,
      c.default_code as codigo_material, 
      h.name as descripcion,
      a.numero_serie as serie,
      a.cantidad as cantidad,
      b.serie_medidor as medidor,
      s.name as sector
    FROM hsg_orden_seriados a
    inner join hsg_orden b on a.orden_id = b.id 
    inner join product_product c on a.producto_id = c.id
    inner join product_template h on c.product_tmpl_id = h.id
    inner join hsg_sector s on b.sector_id = s.id
    left JOIN (
      select 
        to_char(e.fecha_inicio, 'DD/MM/YYYY') as fecha,
        e.cod_cuenta,
        e.codigo_orden,
        f.default_code,
        g.name as name,
        d.numero_serie,
        d.cantidad,
        e.serie_medidor,
        e.sector_id
      from  hsg_orden_seriados d
      inner join hsg_orden e on d.orden_id = e.id 
      inner join product_product f on d.producto_id = f.id 
      inner join product_template g on f.product_tmpl_id = g.id
      where
        f.default_code in ('16134', '16135')
    ) AS subconsulta
    ON b.codigo_orden = subconsulta.codigo_orden
    where
        b.sector_id = ${sede} and
        to_char(b.fecha_inicio,'YYYY/MM/DD')>='${fechaInicio}' and
        to_char(b.fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' and  
      c.default_code not in ('16134', '16135')
    order by b.codigo_orden ASC;
  `);
  /* const ordersNoSeriado = await sequelize.query(`
  select 
    to_char(b.fecha_inicio, 'DD/MM/YYYY'),
    b.cod_cuenta,
    b.codigo_orden,
    c.default_code,
    d.name,
    NULL AS serie,
    a.cantidad,
    b.serie_medidor,
    b.sector_id 
  from hsg_orden_productos a  
  inner join hsg_orden b on a.orden_id = b.id
  inner join product_product c on a.producto_id = c.id 
  inner join  product_template d on c.product_tmpl_id = d.id 
  where 
    to_char(b.fecha_inicio,'YYYY/MM/DD')>='${fechaInicio}' and 
    to_char(b.fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' and 
    b.sector_id = 10; 
  `); */
  const ordersNoSeriado = await sequelize.query(`
  SELECT 
    to_char(b.fecha_inicio, 'DD/MM/YYYY') as fecha_ejecucion,
    CASE WHEN 
      subconsulta.numero_serie IS NULL 
      THEN b.codigo_orden 
      ELSE subconsulta.numero_serie
      END as documento,
    b.cod_cuenta as id,
    b.codigo_orden as num_ot,
    c.default_code as codigo_material, 
    h.name as descripcion,
    NULL as serie,
    a.cantidad as cantidad,
    b.serie_medidor as medidor,
    s.name as sector
  FROM hsg_orden_productos a
  inner join hsg_orden b on a.orden_id = b.id 
  inner join product_product c on a.producto_id = c.id
  inner join product_template h on c.product_tmpl_id = h.id
  inner join hsg_sector s on b.sector_id = s.id
  left JOIN (
    select 
      to_char(e.fecha_inicio, 'DD/MM/YYYY') as fecha,
      e.cod_cuenta,
      e.codigo_orden,
      f.default_code,
      g.name as name,
      d.numero_serie,
      d.cantidad,
      e.serie_medidor,
      e.sector_id
    from  hsg_orden_seriados d
    inner join hsg_orden e on d.orden_id = e.id 
    inner join product_product f on d.producto_id = f.id 
    inner join product_template g on f.product_tmpl_id = g.id
    where
      f.default_code in ('16134', '16135')
  ) AS subconsulta
  ON b.codigo_orden = subconsulta.codigo_orden
  where
    b.sector_id = ${sede} and
    to_char(b.fecha_inicio,'YYYY/MM/DD')>='${fechaInicio}' and
    to_char(b.fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' and  
    c.default_code not in ('16134', '16135')
  order by b.codigo_orden ASC;
  `);

  const data = ordersSeriado[0].concat(ordersNoSeriado[0]);

  return data;
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
