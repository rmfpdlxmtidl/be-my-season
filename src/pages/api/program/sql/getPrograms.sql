SELECT id,
  creation_time,
  title,
  price,
  `type`
FROM program
ORDER BY id DESC
LIMIT ?, ?