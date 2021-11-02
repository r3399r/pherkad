import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import { TYPE } from 'src/constant/Bill';
import { deleteBill, getBills } from 'src/logic/BillService';
import { Bill } from 'src/model/Bill';
import { RootState } from 'src/redux/store';
import { setBills } from 'src/redux/walletSlice';
import { getWeekdayInChinese } from 'src/util/dateHelper';
import EditModal from './EditModal';

const Home = () => {
  const dispatch = useDispatch();
  const wallet = useSelector((rootState: RootState) => rootState.wallet);
  const [editTarget, setEditTarget] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getBills()
      .then((res: Bill[]) => {
        dispatch(setBills(res));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const onAdd = () => {
    setEditTarget(undefined);
    setShowModal(true);
  };

  const onEdit = (i: number) => () => {
    setEditTarget(i);
    setShowModal(true);
  };

  const onDelete = (i: number) => () => {
    deleteBill(wallet.bills[i].id).then((res: Bill[]) => {
      dispatch(setBills(res));
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onLongPress = (i: number) => () => {
    Alert.alert(
      '怎麼了呢?',
      undefined,
      [
        {
          text: '刪除',
          onPress: onDelete(i),
        },
        {
          text: '沒事',
        },
        { text: '修改', onPress: onEdit(i) },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Text style={styles.current}>
        目前餘額:{' '}
        {wallet &&
          wallet.bills &&
          wallet.bills.reduce(
            (a: number, b: Bill) => (b.type === TYPE.MINUS ? a - b.amount : a + b.amount),
            0,
          )}
      </Text>
      <View style={styles.button}>
        <Button title="新增帳目" onPress={onAdd} />
      </View>
      <View style={styles.head}>
        <Text style={styles.headItem}>日期</Text>
        <Text style={styles.headItem}>金額</Text>
        <Text style={styles.headItem}>項目</Text>
      </View>
      <ScrollView>
        {wallet &&
          wallet.bills &&
          wallet.bills.map((v: Bill, i: number) => (
            <View key={v.id}>
              <TouchableOpacity
                style={[styles.row, i % 2 === 0 ? styles.even : styles.odd]}
                onLongPress={onLongPress(i)}
              >
                <Text style={styles.item}>
                  {moment(v.date).format('YYYY-MM-DD')} ({getWeekdayInChinese(moment(v.date).day())}
                  )
                </Text>
                <Text style={[styles.item, v.type === TYPE.MINUS ? styles.red : styles.green]}>
                  {v.type === TYPE.MINUS ? '-' : ''}
                  {v.amount}
                </Text>
                <Text style={styles.item}>{v.note || '-'}</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      <Modal visible={showModal} animationType="slide">
        <EditModal closeModal={closeModal} target={editTarget} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginBottom: 120,
  },
  current: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 20,
  },
  head: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
  },
  headItem: {
    flex: 1,
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderTopColor: 'black',
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  item: {
    flex: 1,
    textAlign: 'center',
  },
  odd: {
    backgroundColor: '#e6b4091f',
  },
  even: {},
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
});

export default Home;
