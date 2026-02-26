import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { ScreenProps } from '../types/interfaces';
import { Strings } from '../constants/strings';

const ProviderDetailsScreen: React.FC<ScreenProps> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const provider = route?.params?.provider;

    const handleCall = () => {
        Linking.openURL(`tel:${provider.phone}`);
    };

    const handleWhatsApp = () => {
        const url = `whatsapp://send?phone=91${provider.phone}`;
        Linking.openURL(url).catch(() => {
            Linking.openURL(`https://wa.me/91${provider.phone}`);
        });
    };

    return (
        <View style={styles.root}>
            {/* HEADER */}
            <View style={[styles.header, { paddingTop: insets.top + verticalScale(8) }]}>

                {/* Back Button */}
                <TouchableOpacity
                    style={[styles.backBtn, { top: insets.top + 6 }]}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={22} color={Colors.white} />
                </TouchableOpacity>

                <View style={styles.avatar}>
                    <Icon name="user" size={40} color={Colors.white} />
                </View>

                <Text style={styles.name}>{provider.name}</Text>
                <Text style={styles.role}>{provider.category}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* INFO CARD */}
                <View style={styles.infoCard}>
                    {/* Location */}
                    <View style={styles.infoRow}>
                        <Icon name="map-pin" size={18} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            {Strings.providerDetails.location}: {provider.city}, Rajasthan, India
                        </Text>
                    </View>

                    {/* Rating */}
                    <View style={styles.infoRow}>
                        <Icon name="star" size={18} color="#FFC107" />
                        <Text style={[styles.infoText, { color: '#FFC107', fontWeight: '700' }]}>
                            {provider.rating} ⭐
                        </Text>
                    </View>

                    {/* Distance */}
                    <View style={styles.infoRow}>
                        <Icon name="navigation" size={18} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            {Strings.providerDetails.distance}: 2.5 km away
                        </Text>
                    </View>
                </View>

                {/* STATS CARD */}
                <View style={styles.statsCard}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{provider.experience || 5}+</Text>
                        <Text style={styles.statLabel}>
                            {Strings.providerDetails.experience}
                        </Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{provider.jobs || 120}+</Text>
                        <Text style={styles.statLabel}>
                            {Strings.providerDetails.servicesDone}
                        </Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{provider.rating}</Text>
                        <Text style={styles.statLabel}>
                            {Strings.providerDetails.rating}
                        </Text>
                    </View>
                </View>

                {/* ABOUT */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {Strings.providerDetails.about}
                    </Text>
                    <Text style={styles.cardDesc}>
                        {provider.name} is a professional {provider.category} with over{' '}
                        {provider.experience || 5} years of experience. He has successfully
                        completed {provider.jobs || 120}+ services with high customer
                        satisfaction and trusted quality work across the city.
                    </Text>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                        <Icon name="phone" size={18} color={Colors.white} />
                        <Text style={styles.btnText}>
                            {Strings.providerDetails.call}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
                        <Icon name="message-circle" size={18} color={Colors.white} />
                        <Text style={styles.btnText}>
                            {Strings.providerDetails.whatsapp}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProviderDetailsScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.backgroundAlt,
    },

    header: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        paddingBottom: verticalScale(26),
        borderBottomLeftRadius: moderateScale(26),
        borderBottomRightRadius: moderateScale(26),
    },

    avatar: {
        height: moderateScale(110),
        width: moderateScale(110),
        borderRadius: moderateScale(55),
        backgroundColor: Colors.primaryCard,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        elevation: 6,
    },

    name: {
        ...Typography.title,
        color: Colors.white,
    },

    role: {
        ...Typography.subtitle,
        color: Colors.primarySoft2,
    },

    infoCard: {
        backgroundColor: Colors.white,
        margin: moderateScale(14),
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        elevation: 3,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        gap: moderateScale(8),
    },

    infoText: {
        ...Typography.small,
        color: Colors.textPrimary,
        flex: 1,
    },

    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: moderateScale(14),
        marginBottom: verticalScale(10),
        backgroundColor: Colors.white,
        borderRadius: moderateScale(16),
        paddingVertical: verticalScale(16),
        elevation: 3,
    },

    statBox: {
        alignItems: 'center',
        flex: 1,
    },

    statNumber: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: Colors.primary,
    },

    statLabel: {
        ...Typography.small,
        color: Colors.textSecondary,
        marginTop: verticalScale(2),
    },

    card: {
        backgroundColor: Colors.white,
        marginHorizontal: moderateScale(14),
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        elevation: 3,
    },

    cardTitle: {
        ...Typography.subtitle,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: verticalScale(6),
    },

    cardDesc: {
        ...Typography.small,
        color: Colors.textSecondary,
        lineHeight: moderateScale(18),
    },

    actionsRow: {
        flexDirection: 'row',
        gap: moderateScale(12),
        margin: moderateScale(14),
    },

    callBtn: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: moderateScale(12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        gap: moderateScale(6),
    },

    whatsappBtn: {
        flex: 1,
        backgroundColor: '#25D366',
        borderRadius: moderateScale(12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        gap: moderateScale(6),
    },

    btnText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: moderateScale(14),
    },
    backBtn: {
        position: 'absolute',
        left: moderateScale(14),
        top: verticalScale(12),
        height: moderateScale(36),
        width: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});