/**
 * A function invoked by Tag Assistant to send messages to the
 * website's GTM script.
 *
 * @param {...any} args - The details of the message to be received
 *                        and processed by the website.
 */
export type ReceiverFunction = (...args: any[]) => void;

/**
 * Tag Assistant API is available at `window.__TAG_ASSISTANT_API`
 * after installing the corresponding browser extension.
 */
export interface TagAssistantApi {
  /**
   * Sets the receiving function that will be called by Tag Assistant
   * to send messages to the website.
   *
   * @param {function} receiverFn - The function that will receive messages.
   */
  setReceiver(receiverFn: ReceiverFunction): void;

  /**
   * Enables GTM to send messages to Tag Assistant.
   *
   * @param {...any} args - The details of the message to be sent.
   */
  sendMessage(...args: any[]): void;

  /**
   * Closes the communication channel between the website and Tag Assistant.
   */
  disconnect(...args: any[]): void
}

export interface TagAssistantTunnelApi extends TagAssistantApi {
  /**
   * Calls Tag Assistant API, with hard-coded receiver function
   */
  setReceiver(): void;
}

declare global {
  interface Window {
    __TAG_ASSISTANT_API: TagAssistantApi;
    __TAG_ASSISTANT_API_TUNNEL: TagAssistantTunnelApi;
    __TAG_ASSISTANT_FORWARDER: ReceiverFunction;
  }
}

export default function tagAssistantMain() {
  const GTM_DEBUG_RE = /[?&]gtm_logging=true/;
  const debug = GTM_DEBUG_RE.test(location.search);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => {};

  const log = debug
    // eslint-disable-next-line no-console
    ? console.log.bind(
      console,
      '%cTag Assistant',
      'background: #357; color: #fff; padding: 2px 4px; border-radius: 4px;'
    )
    : noop;

  /**
   * Hardcoded receiver function, it is going to forward all messages to the
   * window[tagAssistantForwarderName] - worker function exposed to main thread
   */
  const receiver: ReceiverFunction = (...args: any[]) => {
    window.__TAG_ASSISTANT_FORWARDER?.(...args);
  };

  /**
   * Worker calls this function when GTM exposes real receiver on
   * window[tagAssistantForwarderName]. It then forwards the call to Tag Assistant
   */
  function setReceiver() {
    if (window.__TAG_ASSISTANT_API) {
      window.__TAG_ASSISTANT_API.setReceiver(receiver);
    } else {
      log('window.__TAG_ASSISTANT_API is not defined, make sure that Tag Assistant browser extension is present');
    }
  }

  /**
   * Forwards call to Tag Assistant API
   */
  function sendMessage(...args: any[]) {
    window.__TAG_ASSISTANT_API?.sendMessage(...args);
  }

  /**
   * Forwards call to Tag Assistant API
   */
  function disconnect(...args: any[]) {
    window.__TAG_ASSISTANT_API?.disconnect(...args);
  }

  // Make mocked API available to the worker
  window.__TAG_ASSISTANT_API_TUNNEL = {
    setReceiver,
    sendMessage,
    disconnect
  } satisfies TagAssistantTunnelApi;
}



export function tagAssistantWorker() {
  // Mock Tag Assistant API inside worker. All methods are going to call their counterparts
  // in the main thread.
  window.__TAG_ASSISTANT_API = Object.assign({}, window.__TAG_ASSISTANT_API_TUNNEL, {
    // Override setReceiver to enable main <-> worker communication
    setReceiver: (receiver: ReceiverFunction) => {
      // The receiving function is assigned to `window[tagAssistantForwarderName]`,
      // allowing it to be called from the main thread.
      window.__TAG_ASSISTANT_FORWARDER = receiver;

      // The original setReceiver function is called to notify the main thread that
      // the receiver has been set.
      window.__TAG_ASSISTANT_API_TUNNEL.setReceiver();
    }
  });
}