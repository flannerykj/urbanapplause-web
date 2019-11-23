// @flow
import rules from "../rbac-rules";
import type { User, Role } from '../types/user';
import type { AuthRules } from '../types/auth';

const check = (rules: AuthRules, role: ?Role, action: string, data: ?{string: any}) => {
  if (!role) {
    return false
  }
  const permissions = rules[role];
  if (!permissions) {
    // role is not present in the rules
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule not provided for action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }
    return permissionCondition(data);
  }
  return false;
};

type Props = {
  role: ?Role,
  perform: string,
  data: ?{[string]: any},
  yes: () => any,
  no: () => any,
}
const Can = (props: Props) =>
  check(rules, props.role, props.perform, props.data)
    ? props.yes()
    : props.no();

Can.defaultProps = {
  data: null,
  yes: () => null,
  no: () => null
};

export default Can;
