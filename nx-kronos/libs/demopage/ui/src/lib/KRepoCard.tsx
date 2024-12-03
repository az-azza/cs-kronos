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
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <Box maxWidth="100%">
      <Card>
        <Flex gap="3" align="center">
          <Skeleton>
            <Avatar
              size="3"
              ref={imgRef}
              key={item.id + '_1'}
              src={item?.owner?.avatar_url}
              radius="full"
              fallback="T"
            />
          </Skeleton>
          <Box>
            <Text as="div" size="2" weight="bold">
              {item?.name}
            </Text>
            <Text as="div" size="2" color="gray">
              {item?.description}
            </Text>
          </Box>
          <Box>
            <Button asChild>
              <a href={`${item.html_url}`} target="_blank">
                More
              </a>
            </Button>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default KRepoCard;
