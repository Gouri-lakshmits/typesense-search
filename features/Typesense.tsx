import { useQuery } from "@apollo/client";
import Typesense from "typesense";
import { SYSTEM_CONFIG } from "../apollo/queries/config";

const useTypesenseClient = () => {
 
  const { data: configData, loading: configLoading, error: configError } = useQuery(SYSTEM_CONFIG);
  const typesenseClient = new Typesense.Client({
    nodes: [
      {
        host: configData?.typeseSenseSystemConfig.general.node,
        port: configData?.typeseSenseSystemConfig.general.port,
        protocol: configData?.typeseSenseSystemConfig.general.protocol,
      },
    ],
    apiKey: "izunSdbDxLEhLDtETOKnG3n8kTAXx2JF",
    connectionTimeoutSeconds: 2,
  });

  return typesenseClient;
};

export default useTypesenseClient;
