declare module 'react-scroll' {
  import { ComponentType } from 'react';
  
  export interface LinkProps {
    to: string;
    spy?: boolean;
    smooth?: boolean | string;
    offset?: number;
    duration?: number;
    delay?: number;
    isDynamic?: boolean;
    onSetActive?: (to: string) => void;
    onSetInactive?: () => void;
    ignoreCancelEvents?: boolean;
    spyThrottle?: number;
    containerId?: string;
    activeClass?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export const Link: ComponentType<LinkProps>;
  
  export interface ButtonProps extends LinkProps {
    type?: string;
  }
  
  export const Button: ComponentType<ButtonProps>;
  
  export const Element: ComponentType<{name: string, id?: string, className?: string, style?: React.CSSProperties, children?: React.ReactNode}>;
  
  export const Events: {
    scrollEvent: {
      register(eventName: string, callback: () => void): void;
      remove(eventName: string): void;
    };
  };
  
  export const scrollSpy: {
    update(): void;
  };
  
  export const scroller: {
    scrollTo(to: string, props?: {
      duration?: number;
      delay?: number;
      smooth?: boolean | string;
      containerId?: string;
      offset?: number;
      ignoreCancelEvents?: boolean;
    }): void;
  };
  
  export const animateScroll: {
    scrollToTop(options?: {
      duration?: number;
      delay?: number;
      smooth?: boolean | string;
    }): void;
    
    scrollToBottom(options?: {
      duration?: number;
      delay?: number;
      smooth?: boolean | string;
    }): void;
    
    scrollTo(position: number, options?: {
      duration?: number;
      delay?: number;
      smooth?: boolean | string;
    }): void;
    
    scrollMore(to: number, options?: {
      duration?: number;
      delay?: number;
      smooth?: boolean | string;
    }): void;
  };
}
