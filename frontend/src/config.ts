let tmp: string | undefined = process.env.REACT_APP_API_HOST;
let APIHOST: string;
if (tmp === undefined) {
  APIHOST = "http://localhost:3001";
} else {
  APIHOST = tmp as string;
}

export { APIHOST };
