export type AccessTokenPayload = {
  exp: number,
  role: string
}

type DynamicAuthRule = ({string: any}) => boolean

export type RoleRuleSet = {
  static: Array<String>,
  dynamic: { string: DynamicAuthRule }
}

type AuthRules = { [Role]: RoleRuleSet };
