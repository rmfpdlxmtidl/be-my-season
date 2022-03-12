SELECT id,
  creation_time,
  title,
  description,
  price,
  `type`,
  `status`
FROM program
WHERE `type` = ?
ORDER BY id DESC
LIMIT ?, ?