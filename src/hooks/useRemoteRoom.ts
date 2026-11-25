import { useCallback, useEffect, useRef, useState } from 'react';
import Peer, { type DataConnection, type MediaConnection } from 'peerjs';
import type { PartnerState, RoomMessage } from '../types/booth';
import { createDemoCameraStream, type DemoStreamHandle } from '../utils/demoStream';

const PEER_PREFIX = 'purikura-booth-';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export interface UseRemoteRoomOptions {
  localName: string;
  localIsGroup: boolean;
  localStream: MediaStream | null;
  onMessage?: (msg: RoomMessage) => void;
}

export interface UseRemoteRoomResult {
  roomCode: string | null;
  isHost: boolean;
  status: 'idle' | 'creating' | 'waiting' | 'connecting' | 'connected' | 'error';
  error: string | null;
  partner: PartnerState;
  remoteStream: MediaStream | null;
  createRoom: () => void;
  joinRoom: (code: string) => void;
  startDemoPartner: () => void;
  leaveRoom: () => void;
  sendMessage: (msg: RoomMessage) => void;
  sendCursor: (x: number, y: number) => void;
}

export function useRemoteRoom(options: UseRemoteRoomOptions): UseRemoteRoomResult {
  const { localName, localIsGroup, localStream, onMessage } = options;

  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState<UseRemoteRoomResult['status']>('idle');
  const [error, setError] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [partner, setPartner] = useState<PartnerState>({
    name: 'Partner',
    isGroup: false,
    connected: false,
    isDemo: false,
    cursor: null,
  });

  const peerRef = useRef<Peer | null>(null);
  const dataConnRef = useRef<DataConnection | null>(null);
  const mediaConnRef = useRef<MediaConnection | null>(null);
  const demoPartnerRef = useRef<DemoStreamHandle | null>(null);
  const demoCursorTimerRef = useRef<number | null>(null);
  const lastCursorSentRef = useRef<number>(0);

  // Keep latest props in refs so callbacks inside PeerJS listeners never go stale
  const localNameRef = useRef(localName);
  localNameRef.current = localName;
  const localIsGroupRef = useRef(localIsGroup);
  localIsGroupRef.current = localIsGroup;
  const localStreamRef = useRef(localStream);
  localStreamRef.current = localStream;
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const sendMessage = useCallback((msg: RoomMessage) => {
    const conn = dataConnRef.current;
    if (conn && conn.open) {
      conn.send(msg);
    }
  }, []);

  const sendCursor = useCallback(
    (x: number, y: number) => {
      const now = performance.now();
      if (now - lastCursorSentRef.current < 30) return;
      lastCursorSentRef.current = now;
      sendMessage({ type: 'cursor', x, y });
    },
    [sendMessage],
  );

  const cleanupConnections = useCallback(() => {
    if (demoCursorTimerRef.current !== null) {
      window.clearInterval(demoCursorTimerRef.current);
      demoCursorTimerRef.current = null;
    }
    if (demoPartnerRef.current) {
      demoPartnerRef.current.stop();
      demoPartnerRef.current = null;
    }
    if (dataConnRef.current) {
      dataConnRef.current.close();
      dataConnRef.current = null;
    }
    if (mediaConnRef.current) {
      mediaConnRef.current.close();
      mediaConnRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setRemoteStream(null);
    setPartner({
      name: 'Partner',
      isGroup: false,
      connected: false,
      isDemo: false,
      cursor: null,
    });
  }, []);

  const leaveRoom = useCallback(() => {
    cleanupConnections();
    setRoomCode(null);
    setIsHost(false);
    setStatus('idle');
    setError(null);
  }, [cleanupConnections]);

  const attachDataConnection = useCallback((conn: DataConnection) => {
    dataConnRef.current = conn;

    conn.on('open', () => {
      setStatus('connected');
      setError(null);
      setPartner((prev) => ({ ...prev, connected: true, isDemo: false }));
      conn.send({
        type: 'hello',
        name: localNameRef.current || 'Friend',
        isGroup: localIsGroupRef.current,
      } satisfies RoomMessage);
    });

    conn.on('data', (raw) => {
      const msg = raw as RoomMessage;
      if (!msg || typeof msg !== 'object' || !('type' in msg)) return;

      if (msg.type === 'hello') {
        setPartner((prev) => ({
          ...prev,
          name: msg.name || 'Partner',
          isGroup: msg.isGroup,
          connected: true,
        }));
      } else if (msg.type === 'cursor') {
        setPartner((prev) => ({
          ...prev,
          cursor: { x: msg.x, y: msg.y },
        }));
      } else if (msg.type === 'sync_settings') {
        setPartner((prev) => ({
          ...prev,
          name: msg.name ?? prev.name,
          isGroup: msg.isGroup ?? prev.isGroup,
        }));
      }

      onMessageRef.current?.(msg);
    });

    conn.on('close', () => {
      setPartner((prev) => ({ ...prev, connected: false, cursor: null }));
      setStatus('waiting');
    });
  }, []);

  const attachMediaConnection = useCallback((call: MediaConnection) => {
    mediaConnRef.current = call;
    call.on('stream', (stream) => {
      setRemoteStream(stream);
    });
    call.on('close', () => {
      setRemoteStream(null);
    });
  }, []);

  // Re-call partner when localStream becomes ready after room connection
  useEffect(() => {
    const peer = peerRef.current;
    const dataConn = dataConnRef.current;
    if (
      !peer ||
      !dataConn ||
      !dataConn.open ||
      !localStream ||
      mediaConnRef.current ||
      partner.isDemo
    ) {
      return;
    }
    const call = peer.call(dataConn.peer, localStream);
    if (call) {
      attachMediaConnection(call);
    }
  }, [localStream, partner.isDemo, attachMediaConnection]);

  // Broadcast updated local name / hybrid group flag when connected
  useEffect(() => {
    if (partner.connected && !partner.isDemo) {
      sendMessage({
        type: 'sync_settings',
        name: localName,
        isGroup: localIsGroup,
      });
    }
  }, [localName, localIsGroup, partner.connected, partner.isDemo, sendMessage]);

  const createRoom = useCallback(() => {
    cleanupConnections();
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    setStatus('creating');
    setError(null);

    const peer = new Peer(`${PEER_PREFIX}${code}`, {
      debug: 1,
    });
    peerRef.current = peer;

    peer.on('open', () => {
      setStatus('waiting');
    });

    peer.on('connection', (conn) => {
      attachDataConnection(conn);
      if (localStreamRef.current) {
        const call = peer.call(conn.peer, localStreamRef.current);
        if (call) attachMediaConnection(call);
      }
    });

    peer.on('call', (call) => {
      call.answer(localStreamRef.current ?? undefined);
      attachMediaConnection(call);
    });

    peer.on('error', (err) => {
      setStatus('error');
      setError(
        `Connection issue (${err.type || 'network'}). You can retry or preview with Demo Partner.`,
      );
    });
  }, [attachDataConnection, attachMediaConnection, cleanupConnections]);

  const joinRoom = useCallback(
    (rawCode: string) => {
      const code = rawCode.trim().toUpperCase();
      if (!code) return;

      cleanupConnections();
      setRoomCode(code);
      setIsHost(false);
      setStatus('connecting');
      setError(null);

      const peer = new Peer({ debug: 1 });
      peerRef.current = peer;

      peer.on('open', () => {
        const hostId = `${PEER_PREFIX}${code}`;
        const conn = peer.connect(hostId, { reliable: true });
        attachDataConnection(conn);

        if (localStreamRef.current) {
          const call = peer.call(hostId, localStreamRef.current);
          if (call) attachMediaConnection(call);
        }
      });

      peer.on('call', (call) => {
        call.answer(localStreamRef.current ?? undefined);
        attachMediaConnection(call);
      });

      peer.on('error', (err) => {
        setStatus('error');
        setError(
          `Could not join room ${code} (${err.type || 'peer-unavailable'}). Check the code or try Demo Partner.`,
        );
      });
    },
    [attachDataConnection, attachMediaConnection, cleanupConnections],
  );

  const startDemoPartner = useCallback(() => {
    cleanupConnections();
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    setStatus('connected');
    setError(null);

    const demoHandle = createDemoCameraStream('partner', 'Angie');
    demoPartnerRef.current = demoHandle;
    setRemoteStream(demoHandle.stream);

    setPartner({
      name: 'Angie',
      isGroup: false,
      connected: true,
      isDemo: true,
      cursor: { x: 0.68, y: 0.34 },
    });

    // Gentle figure-eight cursor motion so solo testers see live multiplayer cursor
    let tick = 0;
    demoCursorTimerRef.current = window.setInterval(() => {
      tick += 0.06;
      const x = 0.62 + Math.sin(tick) * 0.14;
      const y = 0.36 + Math.sin(tick * 1.6) * 0.11;
      setPartner((prev) => ({
        ...prev,
        cursor: { x, y },
      }));
    }, 55);
  }, [cleanupConnections]);

  useEffect(() => {
    return () => {
      cleanupConnections();
    };
  }, [cleanupConnections]);

  return {
    roomCode,
    isHost,
    status,
    error,
    partner,
    remoteStream,
    createRoom,
    joinRoom,
    startDemoPartner,
    leaveRoom,
    sendMessage,
    sendCursor,
  };
}
