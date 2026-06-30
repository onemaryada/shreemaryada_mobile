import NetInfo from '@react-native-community/netinfo';
import { logger } from './logger';

const TAG = 'NetworkUtil';

class NetworkManager {
  private static instance: NetworkManager;
  private isConnected: boolean = true;
  private listeners: Array<(isConnected: boolean) => void> = [];

  private constructor() {
    this.initializeNetworkListener();
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const previousState = this.isConnected;
      this.isConnected = state.isConnected ?? false;

      if (previousState !== this.isConnected) {
        logger.info(
          TAG,
          `Network status changed: ${this.isConnected ? 'Connected' : 'Disconnected'}`,
        );
        this.notifyListeners();
      }
    });

    // Check initial connection state
    this.checkConnectivity();
  }

  async checkConnectivity(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      this.isConnected = state.isConnected ?? false;
      return this.isConnected;
    } catch (error) {
      logger.error(TAG, 'Error checking connectivity', error);
      return false;
    }
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  subscribe(listener: (isConnected: boolean) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isConnected));
  }
}

export const networkManager = NetworkManager.getInstance();

// Hook-like function for checking connectivity
export const useNetworkConnectivity = (
  onConnected?: () => void,
  onDisconnected?: () => void,
) => {
  const handleNetworkChange = (isConnected: boolean) => {
    if (isConnected) {
      onConnected?.();
    } else {
      onDisconnected?.();
    }
  };

  return networkManager.subscribe(handleNetworkChange);
};
