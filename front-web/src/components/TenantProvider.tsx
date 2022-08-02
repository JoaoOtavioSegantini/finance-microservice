import { createContext, useEffect, useState } from 'react';
import { useAuthSwr } from '../hooks/useAuthSwr';
import { isEqual } from 'lodash'; //lodash
import { PageProps } from './Page';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  balance: number;
}

const TenantContext = createContext<Tenant>(null as any);

export default TenantContext;

export const TenantProvider: React.FunctionComponent<PageProps> = (props) => {
  const [tenant, setTenant] = useState<Tenant>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = useAuthSwr('my-account', {
    refreshInterval: 10000,
  });

  useEffect(() => {
    if (!isEqual(data, tenant)) {
      setTenant(data);
    }
  }, [data, tenant]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TenantContext.Provider value={tenant as any}>
      {props.children}
    </TenantContext.Provider>
  );
};
