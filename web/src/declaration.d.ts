/* eslint-disable */

import React from 'react'

declare module '*.css' {
  const mapping: Record<string, string>
  export default mapping
}

declare global {
  namespace React {
    interface ReactElement {
      nodeName: any;
      attributes: any;
      children: any;
    }
  }
}