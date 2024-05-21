import sequelize from "../libs/sequelize.js";

export const find = async (fechaInicio, fechaFin, sede) => {
  const orders = await sequelize.query(`
  SELECT
    to_char(fecha_inicio,'YYYY/MM/DD') AS fecha,
    e.name AS sector,
    b.codigo_orden AS codigo_orden,
    f.name AS brigada,
    a.zona AS zona,
    c.default_code AS codigo_producto,
    c.name AS nombre_producto,
    d.name AS tipo_orden,
    a.valor AS valor
  from hsg_orden_servicios_digitados a
  LEFT JOIN hsg_orden b ON a.orden_id = b.id
  LEFT JOIN product_template c ON a.producto_id = c.id
  LEFT JOIN hsg_tipo_orden d ON a.tipo_id = d.id
  LEFT JOIN hsg_sector e ON b.sector_id = e.id
  LEFT JOIN hsg_brigadas f ON b.brigada_id = f.id
  WHERE
    to_char(fecha_inicio,'YYYY/MM/DD')>='${fechaInicio}' AND
    to_char(fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' AND
    e.id = ${sede}
  order by fecha_inicio asc;
  `);

  return orders[0];
};

export const findByConsumer = async (fechaInicio, fechaFin, sede) => {
  const ordersSeriado = await sequelize.query(`
  SELECT
    to_char(b.fecha_inicio, 'DD/MM/YYYY') AS fecha_ejecucion,
    CASE WHEN
      subconsulta.numero_serie IS NULL
      THEN b.codigo_orden
      ELSE subconsulta.numero_serie
      END AS documento,
    b.cod_cuenta AS id,
    b.codigo_orden AS num_ot,
    c.default_code AS codigo_material,
    h.name AS descripcion,
    a.numero_serie AS serie,
    a.cantidad AS cantidad,
    b.serie_medidor AS medidor,
    s.name AS sector
  FROM hsg_orden_seriados a
  INNER JOIN hsg_orden b ON a.orden_id = b.id
  INNER JOIN product_product c ON a.producto_id = c.id
  INNER JOIN product_template h ON c.product_tmpl_id = h.id
  INNER JOIN hsg_sector s ON b.sector_id = s.id
  LEFT JOIN (
    SELECT
      e.codigo_orden,
      d.numero_serie,
    FROM  hsg_orden_seriados d
    INNER JOIN hsg_orden e ON d.orden_id = e.id
    INNER JOIN product_product f ON d.producto_id = f.id
    WHERE
      f.default_code in ('16134', '16135')
    ) AS subconsulta
  ON b.codigo_orden = subconsulta.codigo_orden
  WHERE
    b.sector_id = ${sede} AND
    to_char(b.fecha_inicio,'YYYY/MM/DD') >='${fechaInicio}' AND
    to_char(b.fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' AND
    c.default_code not in ('16134', '16135')
  ORDER BY b.codigo_orden ASC;
  `);

  const ordersNoSeriado = await sequelize.query(`
  SELECT
    to_char(b.fecha_inicio, 'DD/MM/YYYY') AS fecha_ejecucion,
    CASE WHEN
      subconsulta.numero_serie IS NULL
      THEN b.codigo_orden
      ELSE subconsulta.numero_serie
      END AS documento,
    b.cod_cuenta AS id,
    b.codigo_orden AS num_ot,
    c.default_code AS codigo_material,
    h.name AS descripcion,
    NULL AS serie,
    a.cantidad AS cantidad,
    b.serie_medidor AS medidor,
    s.name AS sector
  FROM hsg_orden_productos a
  INNER JOIN hsg_orden b ON a.orden_id = b.id
  INNER JOIN product_product c ON a.producto_id = c.id
  INNER JOIN product_template h ON c.product_tmpl_id = h.id
  INNER JOIN hsg_sector s ON b.sector_id = s.id
  LEFT JOIN (
    SELECT
      e.codigo_orden,
      d.numero_serie,
    FROM  hsg_orden_seriados d
    INNER JOIN hsg_orden e ON d.orden_id = e.id
    INNER JOIN product_product f ON d.producto_id = f.id
    WHERE
      f.default_code IN ('16134', '16135')
  ) AS subconsulta
  ON b.codigo_orden = subconsulta.codigo_orden
  WHERE
    b.sector_id = ${sede} AND
    to_char(b.fecha_inicio,'YYYY/MM/DD') >='${fechaInicio}' AND
    to_char(b.fecha_inicio,'YYYY/MM/DD') <='${fechaFin}' AND
    c.default_code NOT IN ('16134', '16135')
  ORDER BY b.codigo_orden ASC;
  `);

  const data = ordersSeriado[0].concat(ordersNoSeriado[0]);

  return data;
};

export const findSector = async () => {
  const sector = await sequelize.query(`
    SELECT
      id,
      name
    from hsg_sector
  `);

  return sector;
};
