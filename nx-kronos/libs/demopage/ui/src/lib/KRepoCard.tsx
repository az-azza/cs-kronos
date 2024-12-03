import styles from './KRepoCard.module.css';

import { useRef, useEffect, useState } from 'react';

import {
  Text,
  Box,
  Card,
  Flex,
  Avatar,
  Skeleton,
  Button,
} from '@radix-ui/themes';

import { TRepoItem } from '@kronos/types';
import KButton from './KButton';

export const KRepoCard = ({ item }: { item: TRepoItem }) => {
  const [imgLoaded, setimgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <Box maxWidth="100%">
      <Card>
        <Flex gap="3" align="center">
          <Skeleton loading={!imgLoaded}>
            <Avatar
              size="3"
              ref={imgRef}
              key={item.id + '_1'}
              src={item?.owner?.avatar_url}
              radius="full"
              fallback="T"
              onLoad={() => {
                setimgLoaded(true);
              }}
            />
          </Skeleton>
          <Box>
            <Skeleton loading={!imgLoaded}>
              <Text as="div" size="2" weight="bold">
                {item?.name}
              </Text>
            </Skeleton>
            <Skeleton loading={!imgLoaded}>
              <Text as="div" size="2" color="gray">
                {item?.description}
              </Text>
            </Skeleton>
          </Box>
          <Box>
            <Button asChild>
              <a href="">sdsd</a>
            </Button>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default KRepoCard;
