import React from 'react';
import { logOut } from "../firebase";

const Logout = () => {
  logOut();
  return null;
}
 
export default Logout;