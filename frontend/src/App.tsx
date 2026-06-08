import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL, WS_URL, api } from './api';
import './App.css';
import type {
  ApiResponse,
  Avatar,
  ElementEntity,
  MapDefaultElement,
  Space,
  SpaceDetails,
  WsServerEvent,
} from './types';

type LoginTarget = 'user' | 'admin';
type Role = 'User' | 'Admin';

function toNumber(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error('Please enter a valid number');
  }
  return parsed;
}

function parseDefaultElements(raw: string): MapDefaultElement[] {
  if (!raw.trim()) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Default elements must be valid JSON');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Default elements must be an array');
  }

  return parsed.map((item) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof item.elementId !== 'string' ||
      typeof item.x !== 'number' ||
      typeof item.y !== 'number'
    ) {
      throw new Error(
        'Each default element must contain elementId (string), x (number), y (number)',
      );
    }

    return {
      elementId: item.elementId,
      x: item.x,
      y: item.y,
    };
  });
}

function asPrettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function App() {
  const wsRef = useRef<WebSocket | null>(null);

  const [activeAction, setActiveAction] = useState<string>('');
  const [output, setOutput] = useState<string>('Ready');

  const [userToken, setUserToken] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string>('');

  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerRole, setRegisterRole] = useState<Role>('User');

  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginTarget, setLoginTarget] = useState<LoginTarget>('user');

  const [metadataAvatarId, setMetadataAvatarId] = useState<string>('');
  const [bulkAvatarIds, setBulkAvatarIds] = useState<string>('');

  const [elementImageUrl, setElementImageUrl] = useState<string>('');
  const [elementWidth, setElementWidth] = useState<string>('1');
  const [elementHeight, setElementHeight] = useState<string>('1');
  const [updateElementId, setUpdateElementId] = useState<string>('');
  const [updateElementImageUrl, setUpdateElementImageUrl] = useState<string>('');

  const [avatarName, setAvatarName] = useState<string>('');
  const [avatarImageUrl, setAvatarImageUrl] = useState<string>('');

  const [mapName, setMapName] = useState<string>('');
  const [mapDimensions, setMapDimensions] = useState<string>('20x20');
  const [mapThumbnail, setMapThumbnail] = useState<string>('');
  const [mapDefaultElements, setMapDefaultElements] = useState<string>('[]');

  const [spaceName, setSpaceName] = useState<string>('');
  const [spaceDimensions, setSpaceDimensions] = useState<string>('10x10');
  const [spaceMapId, setSpaceMapId] = useState<string>('');
  const [spaceToDelete, setSpaceToDelete] = useState<string>('');

  const [arenaSpaceId, setArenaSpaceId] = useState<string>('');
  const [arenaElementId, setArenaElementId] = useState<string>('');
  const [arenaElementSpaceId, setArenaElementSpaceId] = useState<string>('');
  const [arenaElementX, setArenaElementX] = useState<string>('0');
  const [arenaElementY, setArenaElementY] = useState<string>('0');
  const [arenaSpaceElementId, setArenaSpaceElementId] = useState<string>('');

  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [elements, setElements] = useState<ElementEntity[]>([]);
  const [spaceDetails, setSpaceDetails] = useState<SpaceDetails | null>(null);

  const [wsSpaceId, setWsSpaceId] = useState<string>('');
  const [wsDeltaX, setWsDeltaX] = useState<string>('1');
  const [wsDeltaY, setWsDeltaY] = useState<string>('1');
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [wsEvents, setWsEvents] = useState<string[]>([]);

  async function execute<T>(
    label: string,
    operation: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T | undefined) => void,
  ) {
    setActiveAction(label);
    try {
      const response = await operation();
      onSuccess?.(response.data);
      setOutput(`[ok] ${label}\n${asPrettyJson(response)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`[error] ${label}\n${message}`);
    } finally {
      setActiveAction('');
    }
  }

  function requireToken(token: string, label: string) {
    if (!token.trim()) {
      throw new Error(`${label} token is required`);
    }
  }

  function pushWsEvent(event: string) {
    setWsEvents((current) => [event, ...current].slice(0, 30));
  }

  function connectWebSocket() {
    try {
      requireToken(userToken, 'User');
      if (!wsSpaceId.trim()) {
        throw new Error('Space ID is required to join via WebSocket');
      }

      if (wsRef.current && wsConnected) {
        throw new Error('WebSocket is already connected');
      }

      const socket = new WebSocket(WS_URL);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsConnected(true);
        socket.send(
          JSON.stringify({
            type: 'join',
            payload: {
              spaceId: wsSpaceId,
              token: userToken,
            },
          }),
        );
        pushWsEvent('[sent] join');
      };

      socket.onmessage = (message) => {
        try {
          const parsed = JSON.parse(message.data as string) as WsServerEvent;
          pushWsEvent(`[received] ${asPrettyJson(parsed)}`);
        } catch {
          pushWsEvent(`[received] ${String(message.data)}`);
        }
      };

      socket.onerror = () => {
        pushWsEvent('[error] websocket error');
      };

      socket.onclose = () => {
        setWsConnected(false);
        wsRef.current = null;
        pushWsEvent('[closed] websocket connection ended');
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`[error] WebSocket connect\n${message}`);
    }
  }

  function sendMove() {
    try {
      if (!wsRef.current || !wsConnected) {
        throw new Error('WebSocket is not connected');
      }
      const x = toNumber(wsDeltaX);
      const y = toNumber(wsDeltaY);
      wsRef.current.send(JSON.stringify({ type: 'move', payload: { x, y } }));
      pushWsEvent(`[sent] move { x: ${x}, y: ${y} }`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`[error] WebSocket move\n${message}`);
    }
  }

  function leaveSpace() {
    try {
      if (!wsRef.current || !wsConnected) {
        throw new Error('WebSocket is not connected');
      }
      wsRef.current.send(
        JSON.stringify({
          type: 'leave-space',
          payload: { spaceId: wsSpaceId },
        }),
      );
      wsRef.current.close();
      pushWsEvent('[sent] leave-space');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`[error] WebSocket leave\n${message}`);
    }
  }

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <main className="container">
      <header className="panel">
        <h1>MetaVerse Frontend</h1>
        <p>Minimal React client aligned with all backend modules.</p>
        <p>
          API: <code>{API_BASE_URL}</code>
        </p>
        <p>
          WS: <code>{WS_URL}</code>
        </p>
      </header>

      <section className="panel">
        <h2>Session Tokens</h2>
        <div className="grid two">
          <label>
            User token
            <textarea
              value={userToken}
              onChange={(event) => setUserToken(event.target.value)}
              placeholder="Paste USER JWT here"
            />
          </label>
          <label>
            Admin token
            <textarea
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
              placeholder="Paste ADMIN JWT here"
            />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Auth Module</h2>
        <div className="grid three">
          <label>
            Username
            <input
              value={registerUsername}
              onChange={(event) => setRegisterUsername(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
            />
          </label>
          <label>
            Role
            <select
              value={registerRole}
              onChange={(event) => setRegisterRole(event.target.value as Role)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>
        <button
          onClick={() =>
            execute('Auth register', () =>
              api.register(registerUsername, registerPassword, registerRole),
            )
          }
        >
          Register
        </button>

        <div className="grid three">
          <label>
            Login username
            <input
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
            />
          </label>
          <label>
            Login password
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
          </label>
          <label>
            Save token as
            <select
              value={loginTarget}
              onChange={(event) => setLoginTarget(event.target.value as LoginTarget)}
            >
              <option value="user">User token</option>
              <option value="admin">Admin token</option>
            </select>
          </label>
        </div>
        <button
          onClick={() =>
            execute('Auth login', () => api.login(loginUsername, loginPassword), (data) => {
              const token = data?.token ?? '';
              if (loginTarget === 'user') {
                setUserToken(token);
                return;
              }
              setAdminToken(token);
            })
          }
        >
          Login
        </button>
      </section>

      <section className="panel">
        <h2>User Module</h2>
        <div className="grid two">
          <label>
            Avatar ID for /user/metadata
            <input
              value={metadataAvatarId}
              onChange={(event) => setMetadataAvatarId(event.target.value)}
            />
          </label>
          <label>
            Avatar IDs CSV for /user/metadata/bulk/:ids
            <input
              value={bulkAvatarIds}
              onChange={(event) => setBulkAvatarIds(event.target.value)}
              placeholder="id1,id2,id3"
            />
          </label>
        </div>
        <div className="actions">
          <button
            onClick={() => {
              execute('User update metadata', () => {
                requireToken(userToken, 'User');
                return api.updateMetadata(userToken, metadataAvatarId);
              });
            }}
          >
            Update Metadata
          </button>
          <button
            onClick={() => {
              execute('User get avatars', () => {
                requireToken(userToken, 'User');
                return api.getAvatars(userToken);
              }, (data) => setAvatars(data?.avatars ?? []));
            }}
          >
            Load All Avatars
          </button>
          <button
            onClick={() => {
              execute('User get avatars bulk', () => {
                requireToken(userToken, 'User');
                return api.getAvatarBulk(userToken, bulkAvatarIds);
              }, (data) => setAvatars(data?.avatars ?? []));
            }}
          >
            Load Avatar IDs
          </button>
        </div>
        <pre>{asPrettyJson(avatars)}</pre>
      </section>

      <section className="panel">
        <h2>Admin Module</h2>
        <div className="grid three">
          <label>
            Element imageUrl
            <input
              value={elementImageUrl}
              onChange={(event) => setElementImageUrl(event.target.value)}
            />
          </label>
          <label>
            Width
            <input
              value={elementWidth}
              onChange={(event) => setElementWidth(event.target.value)}
            />
          </label>
          <label>
            Height
            <input
              value={elementHeight}
              onChange={(event) => setElementHeight(event.target.value)}
            />
          </label>
        </div>
        <button
          onClick={() => {
            execute('Admin create element', () => {
              requireToken(adminToken, 'Admin');
              return api.createElement(adminToken, {
                imageUrl: elementImageUrl,
                width: toNumber(elementWidth),
                height: toNumber(elementHeight),
              });
            });
          }}
        >
          Create Element
        </button>

        <div className="grid two">
          <label>
            Element ID to update
            <input
              value={updateElementId}
              onChange={(event) => setUpdateElementId(event.target.value)}
            />
          </label>
          <label>
            New imageUrl
            <input
              value={updateElementImageUrl}
              onChange={(event) => setUpdateElementImageUrl(event.target.value)}
            />
          </label>
        </div>
        <button
          onClick={() => {
            execute('Admin update element', () => {
              requireToken(adminToken, 'Admin');
              return api.updateElement(
                adminToken,
                updateElementId,
                updateElementImageUrl,
              );
            });
          }}
        >
          Update Element
        </button>

        <div className="grid two">
          <label>
            Avatar name
            <input
              value={avatarName}
              onChange={(event) => setAvatarName(event.target.value)}
            />
          </label>
          <label>
            Avatar imageUrl
            <input
              value={avatarImageUrl}
              onChange={(event) => setAvatarImageUrl(event.target.value)}
            />
          </label>
        </div>
        <button
          onClick={() => {
            execute('Admin create avatar', () => {
              requireToken(adminToken, 'Admin');
              return api.createAvatar(adminToken, {
                name: avatarName,
                imageUrl: avatarImageUrl,
              });
            });
          }}
        >
          Create Avatar
        </button>

        <div className="grid three">
          <label>
            Map name
            <input
              value={mapName}
              onChange={(event) => setMapName(event.target.value)}
            />
          </label>
          <label>
            Map dimensions (WxH)
            <input
              value={mapDimensions}
              onChange={(event) => setMapDimensions(event.target.value)}
            />
          </label>
          <label>
            Thumbnail (optional)
            <input
              value={mapThumbnail}
              onChange={(event) => setMapThumbnail(event.target.value)}
            />
          </label>
        </div>
        <label>
          Default elements JSON
          <textarea
            value={mapDefaultElements}
            onChange={(event) => setMapDefaultElements(event.target.value)}
            placeholder='[{"elementId":"id","x":1,"y":2}]'
          />
        </label>
        <button
          onClick={() => {
            execute('Admin create map', () => {
              requireToken(adminToken, 'Admin');
              return api.createMap(adminToken, {
                name: mapName,
                dimensions: mapDimensions,
                thumbnail: mapThumbnail || undefined,
                defaultElements: parseDefaultElements(mapDefaultElements),
              });
            });
          }}
        >
          Create Map
        </button>
      </section>

      <section className="panel">
        <h2>Space Module</h2>
        <div className="grid three">
          <label>
            Space name
            <input
              value={spaceName}
              onChange={(event) => setSpaceName(event.target.value)}
            />
          </label>
          <label>
            Dimensions (WxH)
            <input
              value={spaceDimensions}
              onChange={(event) => setSpaceDimensions(event.target.value)}
            />
          </label>
          <label>
            Map ID
            <input
              value={spaceMapId}
              onChange={(event) => setSpaceMapId(event.target.value)}
            />
          </label>
        </div>
        <div className="actions">
          <button
            onClick={() => {
              execute('Space create', () => {
                requireToken(userToken, 'User');
                return api.createSpace(userToken, {
                  name: spaceName,
                  dimensions: spaceDimensions,
                  mapId: spaceMapId,
                });
              });
            }}
          >
            Create Space
          </button>
          <button
            onClick={() => {
              execute('Space get all', () => {
                requireToken(userToken, 'User');
                return api.getMySpaces(userToken);
              }, (data) => setSpaces(data?.spaces ?? []));
            }}
          >
            Load My Spaces
          </button>
        </div>

        <label>
          Space ID to delete
          <input
            value={spaceToDelete}
            onChange={(event) => setSpaceToDelete(event.target.value)}
          />
        </label>
        <button
          onClick={() => {
            execute('Space delete', () => {
              requireToken(userToken, 'User');
              return api.deleteSpace(userToken, spaceToDelete);
            });
          }}
        >
          Delete Space
        </button>

        <pre>{asPrettyJson(spaces)}</pre>
      </section>

      <section className="panel">
        <h2>Arena Module</h2>
        <div className="actions">
          <button
            onClick={() => {
              execute('Arena get all elements', () => {
                requireToken(userToken, 'User');
                return api.getElements(userToken);
              }, (data) => setElements(data?.elements ?? []));
            }}
          >
            Load Elements
          </button>
        </div>

        <label>
          Space ID for /arena/:spaceId
          <input
            value={arenaSpaceId}
            onChange={(event) => setArenaSpaceId(event.target.value)}
          />
        </label>
        <button
          onClick={() => {
            execute('Arena get space details', () => {
              requireToken(userToken, 'User');
              return api.getSpace(userToken, arenaSpaceId);
            }, (data) => setSpaceDetails(data?.space ?? null));
          }}
        >
          Load Space Details
        </button>

        <h3>Add element to space</h3>
        <div className="grid four">
          <label>
            Element ID
            <input
              value={arenaElementId}
              onChange={(event) => setArenaElementId(event.target.value)}
            />
          </label>
          <label>
            Space ID
            <input
              value={arenaElementSpaceId}
              onChange={(event) => setArenaElementSpaceId(event.target.value)}
            />
          </label>
          <label>
            X
            <input
              value={arenaElementX}
              onChange={(event) => setArenaElementX(event.target.value)}
            />
          </label>
          <label>
            Y
            <input
              value={arenaElementY}
              onChange={(event) => setArenaElementY(event.target.value)}
            />
          </label>
        </div>
        <button
          onClick={() => {
            execute('Arena add element', () => {
              requireToken(userToken, 'User');
              return api.addElement(userToken, {
                elementId: arenaElementId,
                spaceId: arenaElementSpaceId,
                x: toNumber(arenaElementX),
                y: toNumber(arenaElementY),
              });
            });
          }}
        >
          Add Element
        </button>

        <label>
          SpaceElement ID for /arena/element delete
          <input
            value={arenaSpaceElementId}
            onChange={(event) => setArenaSpaceElementId(event.target.value)}
          />
        </label>
        <button
          onClick={() => {
            execute('Arena delete element', () => {
              requireToken(userToken, 'User');
              return api.deleteElement(userToken, arenaSpaceElementId);
            });
          }}
        >
          Delete Element
        </button>

        <details>
          <summary>Elements</summary>
          <pre>{asPrettyJson(elements)}</pre>
        </details>
        <details>
          <summary>Space details</summary>
          <pre>{asPrettyJson(spaceDetails)}</pre>
        </details>
      </section>

      <section className="panel">
        <h2>WebSocket (Realtime)</h2>
        <div className="grid three">
          <label>
            Space ID
            <input
              value={wsSpaceId}
              onChange={(event) => setWsSpaceId(event.target.value)}
              placeholder="Used in join payload"
            />
          </label>
          <label>
            Move Δx
            <input
              value={wsDeltaX}
              onChange={(event) => setWsDeltaX(event.target.value)}
            />
          </label>
          <label>
            Move Δy
            <input
              value={wsDeltaY}
              onChange={(event) => setWsDeltaY(event.target.value)}
            />
          </label>
        </div>
        <div className="actions">
          <button onClick={connectWebSocket} disabled={wsConnected}>
            Join Space
          </button>
          <button onClick={sendMove} disabled={!wsConnected}>
            Send Move
          </button>
          <button onClick={leaveSpace} disabled={!wsConnected}>
            Leave Space
          </button>
        </div>
        <p>Status: {wsConnected ? 'connected' : 'disconnected'}</p>
        <pre>{asPrettyJson(wsEvents)}</pre>
      </section>

      <section className="panel">
        <h2>Action Output</h2>
        <p>Running: {activeAction || 'none'}</p>
        <pre>{output}</pre>
      </section>
    </main>
  );
}

export default App;
