import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from 'react-native';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useModalAnimation } from '@/app/hooks/useAnimations';
import { useResponsive } from '@/app/hooks/useResponsive';
import { ModalProps } from '@/app/types';
import { Icon } from '../atoms/Icon';


enum ModalType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}


interface ModalContentConfiguration {
  readonly modalType: ModalType;
  readonly shouldShowTitle: boolean;
  readonly shouldShowIcon: boolean;
  readonly iconName: string;
  readonly iconColor: string;
  readonly iconSize: number;
}


interface ResponsiveModalDimensions {
  readonly width: DimensionValue;
  readonly maxWidth: number;
  readonly padding: number;
  readonly titleFontSize: number;
  readonly messageFontSize: number;
  readonly messageLineHeight: number;
  readonly buttonPaddingVertical: number;
}


interface ModalTextContent {
  readonly buttonText: string;
}


export const CustomModal: React.FC<ModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
}) => {

  const { theme } = useTheme();
  const responsive = useResponsive();
  const { scaleAnim, showModalAnimation, hideModalAnimation } = useModalAnimation();

  useEffect(() => {
    handleModalVisibilityChange();
  }, [isVisible]);


  const getModalTextContent = (): ModalTextContent => {
    return {
      buttonText: 'Continue',
    };
  };

  const determineModalType = (modalTitle: string): ModalType => {
    const titleLowerCase = modalTitle.toLowerCase();
    
    if (titleLowerCase.includes('success') || titleLowerCase.includes('sucesso')) {
      return ModalType.SUCCESS;
    }
    
    if (titleLowerCase.includes('error') || titleLowerCase.includes('erro')) {
      return ModalType.ERROR;
    }
    
    return ModalType.INFO;
  };

  const isSuccessModal = (): boolean => {
    return determineModalType(title) === ModalType.SUCCESS;
  };

  const isErrorModal = (): boolean => {
    return determineModalType(title) === ModalType.ERROR;
  };

  const getModalContentConfiguration = (): ModalContentConfiguration => {
    const modalType = determineModalType(title);
    const ICON_SIZE = 60;

    switch (modalType) {
      case ModalType.SUCCESS:
        return {
          modalType,
          shouldShowTitle: false,
          shouldShowIcon: true,
          iconName: 'checkmark-circle',
          iconColor: theme.colors.success,
          iconSize: ICON_SIZE,
        };

      case ModalType.ERROR:
        return {
          modalType,
          shouldShowTitle: true,
          shouldShowIcon: true,
          iconName: 'close-circle',
          iconColor: theme.colors.error,
          iconSize: ICON_SIZE,
        };

      default:
        return {
          modalType,
          shouldShowTitle: true,
          shouldShowIcon: false,
          iconName: '',
          iconColor: '',
          iconSize: 0,
        };
    }
  };

  const calculateResponsiveModalDimensions = (): ResponsiveModalDimensions => {
    if (responsive.isTablet) {
      return {
        width: '60%' as DimensionValue, 
        maxWidth: 400,
        padding: theme.spacing.xl,
        titleFontSize: theme.typography.sizes.lg,
        messageFontSize: theme.typography.sizes.md,
        messageLineHeight: 24,
        buttonPaddingVertical: theme.spacing.md,
      };
    }

    return {
      width: '85%' as DimensionValue,
      maxWidth: 300,
      padding: theme.spacing.lg,
      titleFontSize: theme.typography.sizes.md,
      messageFontSize: theme.typography.sizes.sm,
      messageLineHeight: 20,
      buttonPaddingVertical: theme.spacing.sm,
    };
  };

  const handleModalVisibilityChange = (): void => {
    if (isVisible) {
      executeShowAnimation();
    } else {
      executeHideAnimation();
    }
  };


  const executeShowAnimation = (): void => {
    showModalAnimation();
  };
 
  const executeHideAnimation = (): void => {
    hideModalAnimation();
  };

  const handleModalClose = (): void => {
    onClose();
  };

  const createOverlayStyles = (): ViewStyle => {
    return {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    };
  };

  const createModalContentStyles = (): ViewStyle => {
    const dimensions = calculateResponsiveModalDimensions();

    return {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: dimensions.padding,
      width: dimensions.width, 
      maxWidth: dimensions.maxWidth,
      alignItems: 'center',
      ...theme.shadows.heavy,
    };
  };

  const createTitleTextStyles = (): TextStyle => {
    const dimensions = calculateResponsiveModalDimensions();

    return {
      color: theme.colors.text,
      fontSize: dimensions.titleFontSize,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    };
  };

  const createMessageTextStyles = (isBold: boolean = false): TextStyle => {
    const dimensions = calculateResponsiveModalDimensions();

    return {
      color: theme.colors.textSecondary,
      fontSize: dimensions.messageFontSize,
      fontFamily: theme.typography.fontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      textAlign: 'center',
      lineHeight: dimensions.messageLineHeight,
      marginBottom: theme.spacing.md,
    };
  };

  const createButtonStyles = (): ViewStyle => {
    const dimensions = calculateResponsiveModalDimensions();

    return {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingVertical: dimensions.buttonPaddingVertical,
      paddingHorizontal: theme.spacing.lg,
      width: '100%',
      alignItems: 'center',
    };
  };

  const createButtonTextStyles = (): TextStyle => {
    const dimensions = calculateResponsiveModalDimensions();

    return {
      color: '#FFFFFF',
      fontSize: dimensions.messageFontSize,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
    };
  };

  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      overlay: createOverlayStyles(),
      content: createModalContentStyles(),
      title: createTitleTextStyles(),
      message: createMessageTextStyles(false),
      messageBold: createMessageTextStyles(true),
      button: createButtonStyles(),
      buttonText: createButtonTextStyles(),
    });
  };

  const renderModalIcon = (contentConfig: ModalContentConfiguration): React.ReactElement | null => {
    if (!contentConfig.shouldShowIcon) {
      return null;
    }

    return (
      <Icon 
        name={contentConfig.iconName} 
        size={contentConfig.iconSize} 
        color={contentConfig.iconColor} 
      />
    );
  };

  const renderModalTitle = (
    contentConfig: ModalContentConfiguration,
    titleStyles: TextStyle
  ): React.ReactElement | null => {
    if (!contentConfig.shouldShowTitle) {
      return null;
    }

    return (
      <Text style={titleStyles}>
        {title}
      </Text>
    );
  };

  const renderModalMessage = (
    contentConfig: ModalContentConfiguration,
    messageStyles: TextStyle,
    messageBoldStyles: TextStyle
  ): React.ReactElement => {
    const shouldUseBoldStyle = contentConfig.modalType === ModalType.SUCCESS;
    const appliedStyles = shouldUseBoldStyle ? messageBoldStyles : messageStyles;

    return (
      <Text style={appliedStyles}>
        {message}
      </Text>
    );
  };

  const renderActionButton = (
    buttonStyles: ViewStyle,
    buttonTextStyles: TextStyle,
    textContent: ModalTextContent
  ): React.ReactElement => {
    const BUTTON_ACTIVE_OPACITY = 0.8;

    return (
      <TouchableOpacity 
        style={buttonStyles} 
        onPress={handleModalClose} 
        activeOpacity={BUTTON_ACTIVE_OPACITY}
      >
        <Text style={buttonTextStyles}>
          {textContent.buttonText}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderModalContent = (
    contentConfig: ModalContentConfiguration,
    styles: any,
    textContent: ModalTextContent
  ): React.ReactElement => {
    const iconElement = renderModalIcon(contentConfig);
    const titleElement = renderModalTitle(contentConfig, styles.title);
    const messageElement = renderModalMessage(contentConfig, styles.message, styles.messageBold);
    const buttonElement = renderActionButton(styles.button, styles.buttonText, textContent);

    return (
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        {iconElement}
        {titleElement}
        {messageElement}
        {buttonElement}
      </Animated.View>
    );
  };

  const renderModalContainer = (
    overlayStyles: ViewStyle,
    modalContent: React.ReactElement
  ): React.ReactElement => {
    return (
      <Modal 
        visible={isVisible} 
        transparent 
        animationType="fade" 
        onRequestClose={handleModalClose}
      >
        <View style={overlayStyles}>
          {modalContent}
        </View>
      </Modal>
    );
  };

 
  const dynamicStyles = createDynamicStylesheet();
  const contentConfiguration = getModalContentConfiguration();
  const textContent = getModalTextContent();
  
  const modalContent = renderModalContent(
    contentConfiguration,
    dynamicStyles,
    textContent
  );
  
  const modalContainer = renderModalContainer(
    dynamicStyles.overlay,
    modalContent
  );

  return modalContainer;
};