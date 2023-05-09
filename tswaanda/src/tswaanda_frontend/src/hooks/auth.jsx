import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

const canisterId = "s55qq-oqaaa-aaaaa-aaakq-cai";

// import { useContext } from "react";
// import { UserContext } from "../UserContext";

// interface authHandlerProps {
//     successHandler?: Function;
//     errorHandler?: Function;
// }

const idlFactory = ({ IDL }) =>
  IDL.Service({
    whoami: IDL.Func([], [IDL.Principal], []),
  });

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30, // set to 30 minutes
    disableDefaultIdleCallback: true, // disable the default reload behavior
  },
});

const useAuth = (session, setSession) => {
  const isLoggedIn = async () => await authClient.isAuthenticated();

  const identity = async () => await authClient.getIdentity();

  const actor = async () => {
    let identity = authClient.getIdentity();
    return Actor.createActor(idlFactory, {
      agent: new HttpAgent({
        identity,
        host: "http://localhost:5173",
      }),
      canisterId,
    });
  };

  const login = async (successHandler, errorHandler) => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    authClient.login({
      onSuccess: async () => {
        successHandler();
        setSession(true);
      },
      onError: async () => {
        errorHandler();
        setSession(false);
      },
      identityProvider: "https://identity.ic0.app/#authorize",
      // `http://localhost:${process.env.REPLICA_PORT}?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}#authorize`,
      // Maximum authorization expiration is 8 days
      maxTimeToLive: days * hours * nanoseconds,
    });
  };

  const logout = async () => {
    await authClient.logout();
    setSession(false);
  };

  return {
    isLoggedIn,
    identity,
    actor,
    login,
    logout,
  };
};

export default useAuth;
