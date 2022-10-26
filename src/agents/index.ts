import type { Agent } from '../types/agent.js';

import { usProxy, ukProxy, newProxy, socksProxy, anonymousProxy, sslProxies } from './freeProxyList.js';
import { geoNode } from './geoNode.js';
import { spysMeHttp, spysMeSocks } from './spysMe.js';
import { hideMyName } from './hideMyName.js';
import { proxyScrapeHttp, proxyScrapeSocks4, proxyScrapeSocks5 } from './proxyScrape.js';
import { proxy11One, proxy11Two } from './proxy11.js';
import { proxyListDownloadHttp, proxyListDownloadHttps, proxyListDownloadSocks4, proxyListDownloadSocks5 } from './proxyListDownload.js';
import { openProxyHttp, openProxySocks4, openProxySocks5 } from './openProxy.js';
import { proxyNova } from './proxyNova.js';
import { vpnOverview } from './vpnOverview.js';
import { advancedName } from './advancedName.js';
import { freeProxyListCom } from './freeProxyListCom.js';
import { javaTPoint } from './javaTPoint.js';
import { proxyDaily } from './proxyDaily.js';
import { hidester } from './hidester.js';
import { freeProxyWorld } from './freeProxyWorld.js';
import { anonymouse } from './anonymouse.js';
import { proxyListOrg } from './proxyListOrg.js';
import { freeProxyListCc } from './freeProxyListCc.js';
import { proxyScanHttp, proxyScanHttps, proxyScanSocks4, proxyScanSocks5 } from './proxyScan.js';
import { monosansHttp, monosansSocks4, monosansSocks5 } from './monosans.js';
import { theSpeedXHttp, theSpeedXSocks4, theSpeedXSocks5 } from './theSpeedX.js';
// import { freeProxyCz } from './freeProxyCz.js';
import { freeProxyPro } from './freeProxyPro.js';
import { scrapingAnt } from './scrapingAnt.js';
import { vpnSide } from './vpnSide.js';
import { ipRoyal } from './ipRoyal.js';

export const agents: Agent[] = [
    // ipRoyal,
    // vpnSide,
    // scrapingAnt,
    // freeProxyPro,
    // theSpeedXHttp,
    // theSpeedXSocks4,
    // theSpeedXSocks5,
    // monosansHttp,
    // monosansSocks4,
    // monosansSocks5,
    // proxyScanHttp,
    // proxyScanHttps,
    // proxyScanSocks4,
    // proxyScanSocks5,
    // proxyListOrg,
    // geoNode,
    // freeProxyListCc,
    // anonymouse,
    // freeProxyWorld,
    // hidester,
    // proxyDaily,
    // javaTPoint,
    // freeProxyListCom,
    // advancedName,
    // vpnOverview,
    // proxyNova,
    proxy11One,
    proxy11Two,
    // proxyListDownloadHttp,
    // proxyListDownloadHttps,
    // proxyListDownloadSocks4,
    // proxyListDownloadSocks5,
    // openProxyHttp,
    // openProxySocks4,
    // openProxySocks5,
    // usProxy,
    // ukProxy,
    // newProxy,
    // socksProxy,
    // anonymousProxy,
    // sslProxies,
    // spysMeHttp,
    // spysMeSocks,
    // hideMyName,
    // proxyScrapeHttp,
    // proxyScrapeSocks4,
    // proxyScrapeSocks5,
    //////////////freeProxyCz,
];
