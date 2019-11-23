import authActions from "./auth";
import worksActions from "./works";
import artistsActions from "./artists";
import userprofilesActions from "./userprofiles";

const actions = Object.assign({},authActions,worksActions,artistsActions, userprofilesActions);

export default actions;
