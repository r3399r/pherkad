import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { TYPE } from 'src/constant/Accounting';
import { RootState } from 'src/redux/store';
import { addAccounting, editAccounting } from 'src/redux/walletSlice';

type Props = {
  closeModal: () => void;
  target?: number;
};

const EditModal = ({ closeModal, target }: Props) => {
  const dispatch = useDispatch();
  const wallet = useSelector((rootState: RootState) => rootState.wallet);
  const [type, setType] = useState<TYPE>(TYPE.ADD);
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<number>();
  const [note, setNote] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (target !== undefined) {
      setType(wallet.accountings[target].type);
      setDate(new Date(wallet.accountings[target].date));
      setAmount(wallet.accountings[target].amount);
      setNote(wallet.accountings[target].note);
    }
  }, [target]);

  const onChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeAmount = (v: string) => {
    if (v === '') setAmount(undefined);
    if (/^[0-9]+$/g.test(v)) setAmount(Number(v));
  };

  const onChangeNote = (v: string) => setNote(v);

  const showDatepicker = () => setShow(true);

  const onTypeChange = (newValue: string) => setType(newValue as TYPE);

  const onSubmit = () => {
    const accounting = { type, date: moment(date).valueOf(), amount: amount || 0, note };
    if (target === undefined) dispatch(addAccounting(accounting));
    else dispatch(editAccounting({ i: target, accounting }));
    closeModal();
  };

  const onCancel = () => {
    closeModal();
  };

  const inputAmount = amount === undefined ? '' : String(amount);

  return (
    <View style={styles.container}>
      <RadioButton.Group onValueChange={onTypeChange} value={type}>
        <View style={styles.radioGroup}>
          <RadioButton.Item
            label="儲值"
            value={TYPE.ADD}
            color="#005A9C"
            style={styles.radioItem}
            labelStyle={styles.text}
            position="leading"
          />
          <RadioButton.Item
            label="扣錢"
            value={TYPE.MINUS}
            color="#005A9C"
            style={styles.radioItem}
            labelStyle={styles.text}
            position="leading"
          />
        </View>
      </RadioButton.Group>
      <View style={styles.item}>
        <Text style={[styles.text, styles.key]}>日期</Text>
        <Text style={[styles.text, styles.value]} onPress={showDatepicker}>
          {moment(date).format('YYYY-MM-DD')}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.text, styles.key]}>金額</Text>
        <TextInput
          style={[styles.value, styles.text]}
          placeholder="金額"
          keyboardType="numeric"
          onChangeText={onChangeAmount}
          value={inputAmount}
        />
      </View>
      <View style={styles.item}>
        <Text style={[styles.text, styles.key]}>項目</Text>
        <TextInput
          style={[styles.value, styles.text]}
          placeholder="項目"
          onChangeText={onChangeNote}
          value={note}
        />
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button title="送出" onPress={onSubmit} />
        </View>
        <View style={styles.button}>
          <Button color="grey" title="取消" onPress={onCancel} />
        </View>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  key: {
    flex: 1,
    textAlign: 'center',
  },
  value: {
    flex: 2,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default EditModal;
