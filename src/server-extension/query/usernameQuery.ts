export const usernameByIdentityQuery = `
  SELECT * FROM username WHERE address = $1
   AND ($2::boolean = false OR username.primary = true)
`
