import React from 'react';
import { logOut } from "../services/firebase";

const Logout = () => {
  logOut();
  return null;
}
 
export default Logout;