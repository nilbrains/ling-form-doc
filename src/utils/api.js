import { createAlova } from 'alova';
import { xhrRequestAdapter } from '@alova/adapter-xhr';

export const api = createAlova({
    requestAdapter: xhrRequestAdapter()
});