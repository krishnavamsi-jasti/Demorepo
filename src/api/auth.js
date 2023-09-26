import defaultUser from "../utils/default-user";
import api from "../utils/api";

let USER_INFO = null;

const loginToPortal = (userId, password, appKey) => {
  return fetch(
    api.url+"EcommUser/CheckUserExist/?userId=" +
      userId +
      "&password=" +
      password,
    {
      method: "GET",
      headers: {
        APP_KEY: appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    }
  );
};

const fetchClientData = (clientId, appKey) => {
  return fetch(
    api.url+"Client/GetClientInfo?clientid=" +
      clientId,
    {
      method: "GET",
      headers: {
        APP_KEY: appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    }
  );
};

export async function signIn(companyname, userId, password) {
  try {
    // Send request for APP_Key
    const appIdData = await fetch(
      api.url + "Login/GetCompanyAsync/?companyname=" + companyname,
      {
        method: "GET",
        headers: {
          "ZUMO-API-VERSION": "2.0.0",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.error(error);
        return {
          isOk: false,
          message: "Authentication failed",
        };
      });

    if (!appIdData) {
      return {
        isOk: false,
        message: "Invalid Company Name",
      };
    }
    const userData = await loginToPortal(
      userId,
      password,
      appIdData.appKey
    ).then((response) => response.json());
    if (!userData) {
      return {
        isOk: false,
        message: "Invalid Credentials",
      };
    }
    const clientData = await fetchClientData(userData.item.ClientId, appIdData.appKey)
    .then((response) => response.json());
    console.log(clientData);
    USER_INFO = {
      data: {
        ...userData.item,
        ...defaultUser,
        email: userData.item.EmployeeName,
        ...clientData,
        appKey: appIdData.appKey,
        appIdData: {...appIdData}
      },
      isOk: true,
    };
    localStorage.setItem('USER_INFO', JSON.stringify(USER_INFO));
    return USER_INFO;

    //Send request with APP_KEY and user credentials
  } catch {
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

export async function getUser() {
  try {
    // Send request
    const USER_STORAGE_DATA = localStorage.getItem('USER_INFO') ? JSON.parse(localStorage.getItem('USER_INFO')) : null;
    if (USER_STORAGE_DATA) return USER_STORAGE_DATA;
    return {
      isOk: false,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to create account",
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}
