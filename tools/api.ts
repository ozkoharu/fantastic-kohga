import * as Types from 'tools/types';

// APIとの通信周りの関数と型たち

interface ApiResult {
    succeeded: boolean,     // 処理に成功すると真
};
type GeneralId = string;
export type UserId = GeneralId;

const API_SERVER = 'http://sazasub.kohga.local';

async function postJsonApi(url: string, query: any) {
    const res = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(query),
        }
    );
    return await res.json();
}

export interface CreateUserResult extends ApiResult {
    userId?: UserId,
};
export async function createUser() {
    const API_PATH = '/createUser';
    const res = await fetch(
        API_SERVER + API_PATH,
        {
            method: "GET"
        }
    );
    return await res.json() as CreateUserResult;
}

interface IsAcceptableQuery {
    userId: UserId,
};
export interface IsAcceptableResult extends ApiResult {
    // Nothing yet
};
export async function isAcceptable(userId: UserId) {
    const API_PATH = '/isAcceptable';
    const query: IsAcceptableQuery = {
        userId: userId,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as IsAcceptableResult;
}

export interface AstarArg {
    data: Types.Position[],
};
interface AstarQuery extends AstarArg {
    userId: UserId,
};
export interface AstarResult extends ApiResult {
    route?: Types.Position[] | null,
    reason?: string,
};
export async function astar(userId: UserId, args: AstarArg) {
    const API_PATH = '/astar';
    const query: AstarQuery = {
        userId: userId,
        ...args,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as IsAcceptableResult;
}

export interface ExecRouteArg {
    data: Types.Position[][],
    junkai: boolean,
};
interface ExecRouteQuery extends ExecRouteArg {
    userId: UserId,
};
export interface ExecRouteResult extends ApiResult {
    message?: string,
};
export async function execRoute(userId: UserId, args: ExecRouteArg) {
    const API_PATH = '/execRoute';
    const query: ExecRouteQuery = {
        userId: userId,
        ...args,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as ExecRouteResult;
}

export interface SaveRouteArg {
    routeName: string,
    data: Types.Position[][],
    junkai: boolean,
};
interface SaveRouteQuery extends SaveRouteArg {
    userId: UserId,
};
export interface SaveRouteResult extends ApiResult {
    routeName?: string,
    message?: string,
};
export async function saveRoute(userId: UserId, args: SaveRouteArg) {
    const API_PATH = '/saveRoute';
    const query: SaveRouteQuery = {
        userId: userId,
        ...args
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as SaveRouteResult;
}

interface MonitorCarQuery {
    userId: UserId,
};
export interface MonitorCarResult extends ApiResult {
    reserve?: boolean,
    route?: Types.Position[][],
    dest?: Types.Position[],
    arrival?: boolean,
    finish?: boolean,
    arrange?: boolean,
    status?: boolean,
    nowPoints?: Types.Position,
    battery?: number,
};
export async function monitorCar(userId: UserId) {
    const API_PATH = '/monitorCar';
    const query: MonitorCarQuery = {
        userId: userId,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as MonitorCarResult;
}

interface ProceedRouteQuery {
    userId: UserId,
};
export interface ProceedRouteResult extends ApiResult {
    // Nothing yet
};
export async function proceedRoute(userId: UserId) {
    const API_PATH = '/proceedRoute';
    const query: ProceedRouteQuery = {
        userId: userId,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as ProceedRouteResult;
}

interface EndRouteQuery {
    userId: UserId,
};
export interface EndRouteResult extends ApiResult {
    // Nothing yet
};
export async function endRoute(userId: UserId) {
    const API_PATH = '/endRoute';
    const query: EndRouteQuery = {
        userId: userId,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as EndRouteResult;
}

interface TerminateQuery {
    userId: UserId,
};
export interface TerminateResult extends ApiResult {
    // Nothing yet
};
export async function terminate(userId: UserId) {
    const API_PATH = '/terminate';
    const query: TerminateQuery = {
        userId: userId,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as TerminateResult;
}

interface RouteNameQuery {
    userId: UserId,
};
export interface RouteNameResult extends ApiResult {
    passbleNames?: Types.PassbleNames[],
};
export async function routeName(userId: UserId) {
    const API_PATH = '/routeName';
    const query: RouteNameQuery = {
        userId: userId
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as RouteNameResult;
}

export interface ReqRouteArg {
    routeName: string,
};
interface ReqRouteQuery extends ReqRouteArg {
    userId: UserId,
};
export interface ReqRouteResult extends ApiResult {
    route?: Types.Position[][],
    dest?: Types.Position[],
    junkai?: boolean,
};
export async function reqRoute(userId: UserId, args: ReqRouteArg) {
    const API_PATH = '/reqRoute';
    const query: ReqRouteQuery = {
        userId: userId,
        ...args,
    };
    return await postJsonApi(API_SERVER + API_PATH, query) as ReqRouteResult;
}

interface ReqPassableQuery {
    userId: UserId,
};
export interface ReqPassableResult extends ApiResult {
    passbleInfo?: Types.PassableInfo,
};
export async function reqPassable(userId: UserId) {
    const API_PATH = '/reqPassable';
    const query: ReqPassableQuery = {
        userId: userId
    }
    return await postJsonApi(API_SERVER + API_PATH, query) as ReqPassableResult;
}
