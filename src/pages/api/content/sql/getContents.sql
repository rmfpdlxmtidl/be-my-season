SELECT id,
  creation_time,
  title,
  description,
  `type`
FROM content
ORDER BY id DESC
LIMIT ?, ?