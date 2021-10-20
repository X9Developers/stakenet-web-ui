import React, { useContext, useRef } from 'react';
import { MenuFlyout, MenuItem } from './styleds';
import { Text } from 'rebass';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { AutoColumn } from 'components/Column';
import { TYPE } from 'theme';
import QuestionHelper from '../../components/QuestionHelper/index';
import { ThemeContext } from 'styled-components';
import Row from 'components/Row';
import SlippageTabs from './transactionSettings';

interface SettingsTabProps {
  showSettings: boolean
  toggle: () => void
  recover: () => void
  slippage: number
  setSlippage: (num: number) => void
}

export const SettingsTab = ({ showSettings, toggle, recover, slippage, setSlippage }: SettingsTabProps) => {

  const node = useRef<HTMLDivElement>()

  useOnClickOutside(node, showSettings ? toggle : undefined)
  const theme = useContext(ThemeContext)


  return (
    <div ref={node as any}>
      {(showSettings) &&
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              Transaction Settings
            </Text>
            <Row>
              <MenuItem onClick={() => {
                toggle()
                recover()
              }}>
                <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                  Recover and Withdraw
                </TYPE.black>
              </MenuItem>
              <QuestionHelper text="Looking for Balance in state channels if exists then withdrawing" />
            </Row>
            <SlippageTabs
              rawSlippage={slippage}
              setRawSlippage={setSlippage}
            />
          </AutoColumn>
        </MenuFlyout>
      }
    </div>
  )
}
