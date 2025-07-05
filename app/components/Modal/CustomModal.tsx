import React, { useState, useEffect } from 'react';
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
import { CircleCheck, XCircleIcon } from 'lucide-react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface CustomModalProps {
  readonly isVisible: boolean;
  readonly title: string;
  readonly message: string;
  readonly onClose: () => void;
}

enum ModalType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

interface ModalVisualConfiguration {
  readonly modalType: ModalType;
  readonly shouldShowTitle: boolean;
  readonly shouldShowIcon: boolean;
  readonly iconComponent: React.ReactElement | null;
  readonly messageWeight: 'normal' | 'bold';
}

interface ModalLayoutConfiguration {
  readonly overlayPadding: number;
  readonly modalBorderRadius: number;
  readonly modalPadding: number;
  readonly modalWidth: DimensionValue;
  readonly modalMaxWidth: number;
  readonly iconSize: number;
  readonly iconMarginBottom: number;
  readonly titleMarginBottom: number;
  readonly messageMarginBottom: number;
  readonly buttonBorderRadius: number;
  readonly buttonPaddingVertical: number;
  readonly buttonPaddingHorizontal: number;
}

interface ModalTextContent {
  readonly buttonText: string;
}

interface ModalTypographyConfiguration {
  readonly titleFontSize: number;
  readonly titleFontWeight: string;
  readonly messageFontSize: number;
  readonly buttonFontSize: number;
  readonly buttonFontWeight: string;
}


interface ModalAnimationConfiguration {
  readonly initialScale: number;
  readonly targetScale: number;
  readonly useNativeDriver: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
}) => {

  const { theme } = useTheme();
  const [animationScale] = useState(new Animated.Value(0));

  useEffect(() => {
    handleModalVisibilityChange();
  }, [isVisible]);


  const getModalTextContent = (): ModalTextContent => {
    return {
      buttonText: 'Continue',
    };
  };


  const getModalLayoutConfiguration = (): ModalLayoutConfiguration => {
    return {
      overlayPadding: 20,
      modalBorderRadius: 10,
      modalPadding: 20,
      modalWidth: '85%' as DimensionValue,
      modalMaxWidth: 300,
      iconSize: 60,
      iconMarginBottom: 16,
      titleMarginBottom: 8,
      messageMarginBottom: 16,
      buttonBorderRadius: 8,
      buttonPaddingVertical: 10,
      buttonPaddingHorizontal: 20,
    };
  };

  const getModalTypographyConfiguration = (): ModalTypographyConfiguration => {
    return {
      titleFontSize: 18,
      titleFontWeight: '600',
      messageFontSize: 14,
      buttonFontSize: 14,
      buttonFontWeight: '600',
    };
  };

  const getModalAnimationConfiguration = (): ModalAnimationConfiguration => {
    return {
      initialScale: 0,
      targetScale: 1,
      useNativeDriver: true,
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

  const isSuccessModalType = (): boolean => {
    return determineModalType(title) === ModalType.SUCCESS;
  };

  const isErrorModalType = (): boolean => {
    return determineModalType(title) === ModalType.ERROR;
  };

  const createSuccessIconComponent = (
    iconSize: number,
    iconColor: string,
    iconStyle: ViewStyle
  ): React.ReactElement => {
    return (
      <CircleCheck 
        size={iconSize} 
        color={iconColor} 
        style={iconStyle} 
      />
    );
  };

  const createErrorIconComponent = (
    iconSize: number,
    iconColor: string,
    iconStyle: ViewStyle
  ): React.ReactElement => {
    return (
      <XCircleIcon 
        size={iconSize} 
        color={iconColor} 
        style={iconStyle} 
      />
    );
  };


  const getModalVisualConfiguration = (): ModalVisualConfiguration => {
    const modalType = determineModalType(title);
    const layoutConfig = getModalLayoutConfiguration();
    const iconStyle: ViewStyle = { marginBottom: layoutConfig.iconMarginBottom };

    switch (modalType) {
      case ModalType.SUCCESS:
        return {
          modalType,
          shouldShowTitle: false,
          shouldShowIcon: true,
          iconComponent: createSuccessIconComponent(
            layoutConfig.iconSize,
            theme.colors.success,
            iconStyle
          ),
          messageWeight: 'bold',
        };

      case ModalType.ERROR:
        return {
          modalType,
          shouldShowTitle: true,
          shouldShowIcon: true,
          iconComponent: createErrorIconComponent(
            layoutConfig.iconSize,
            theme.colors.error,
            iconStyle
          ),
          messageWeight: 'normal',
        };

      default:
        return {
          modalType,
          shouldShowTitle: true,
          shouldShowIcon: false,
          iconComponent: null,
          messageWeight: 'normal',
        };
    }
  };

  const handleModalVisibilityChange = (): void => {
    if (isVisible) {
      executeShowAnimation();
    } else {
      executeHideAnimation();
    }
  };

  const executeShowAnimation = (): void => {
    const animationConfig = getModalAnimationConfiguration();
    
    Animated.spring(animationScale, {
      toValue: animationConfig.targetScale,
      useNativeDriver: animationConfig.useNativeDriver,
    }).start();
  };

  const executeHideAnimation = (): void => {
    const animationConfig = getModalAnimationConfiguration();
    animationScale.setValue(animationConfig.initialScale);
  };

  const handleModalCloseAction = (): void => {
    onClose();
  };


  const createOverlayStyles = (): ViewStyle => {
    const layoutConfig = getModalLayoutConfiguration();
    
    return {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: layoutConfig.overlayPadding,
    };
  };

  const createModalContainerStyles = (): ViewStyle => {
    const layoutConfig = getModalLayoutConfiguration();
    
    return {
      backgroundColor: theme.colors.surface,
      borderRadius: layoutConfig.modalBorderRadius,
      padding: layoutConfig.modalPadding,
      width: layoutConfig.modalWidth,
      maxWidth: layoutConfig.modalMaxWidth,
      alignItems: 'center',
    };
  };


  const createTitleTextStyles = (): TextStyle => {
    const typographyConfig = getModalTypographyConfiguration();
    const layoutConfig = getModalLayoutConfiguration();
    
    return {
      fontSize: typographyConfig.titleFontSize,
      fontWeight: typographyConfig.titleFontWeight as any,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: layoutConfig.titleMarginBottom,
    };
  };

  const createMessageTextStyles = (fontWeight: 'normal' | 'bold'): TextStyle => {
    const typographyConfig = getModalTypographyConfiguration();
    const layoutConfig = getModalLayoutConfiguration();
    
    return {
      fontSize: typographyConfig.messageFontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: layoutConfig.messageMarginBottom,
      fontWeight,
    };
  };

  const createButtonStyles = (): ViewStyle => {
    const layoutConfig = getModalLayoutConfiguration();
    
    return {
      backgroundColor: theme.colors.accent,
      borderRadius: layoutConfig.buttonBorderRadius,
      paddingVertical: layoutConfig.buttonPaddingVertical,
      paddingHorizontal: layoutConfig.buttonPaddingHorizontal,
      width: '100%',
      alignItems: 'center',
    };
  };

  const createButtonTextStyles = (): TextStyle => {
    const typographyConfig = getModalTypographyConfiguration();
    
    return {
      color: '#fff',
      fontWeight: typographyConfig.buttonFontWeight as any,
      fontSize: typographyConfig.buttonFontSize,
    };
  };

  const createDynamicStylesheet = (visualConfig: ModalVisualConfiguration) => {
    return StyleSheet.create({
      overlay: createOverlayStyles(),
      modalContainer: createModalContainerStyles(),
      title: createTitleTextStyles(),
      message: createMessageTextStyles(visualConfig.messageWeight),
      button: createButtonStyles(),
      buttonText: createButtonTextStyles(),
    });
  };


  const renderModalIcon = (visualConfig: ModalVisualConfiguration): React.ReactElement | null => {
    if (!visualConfig.shouldShowIcon || !visualConfig.iconComponent) {
      return null;
    }

    return visualConfig.iconComponent;
  };

  const renderModalTitle = (
    visualConfig: ModalVisualConfiguration,
    titleStyles: TextStyle
  ): React.ReactElement | null => {
    if (!visualConfig.shouldShowTitle) {
      return null;
    }

    return (
      <Text style={titleStyles}>
        {title}
      </Text>
    );
  };


  const renderModalMessage = (messageStyles: TextStyle): React.ReactElement => {
    return (
      <Text style={messageStyles}>
        {message}
      </Text>
    );
  };

  const renderActionButton = (
    buttonStyles: ViewStyle,
    buttonTextStyles: TextStyle,
    textContent: ModalTextContent
  ): React.ReactElement => {
    return (
      <TouchableOpacity 
        style={buttonStyles} 
        onPress={handleModalCloseAction}
      >
        <Text style={buttonTextStyles}>
          {textContent.buttonText}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderModalContent = (
    visualConfig: ModalVisualConfiguration,
    styles: any,
    textContent: ModalTextContent
  ): React.ReactElement => {
    const iconElement = renderModalIcon(visualConfig);
    const titleElement = renderModalTitle(visualConfig, styles.title);
    const messageElement = renderModalMessage(styles.message);
    const buttonElement = renderActionButton(styles.button, styles.buttonText, textContent);

    return (
      <Animated.View style={[styles.modalContainer, { transform: [{ scale: animationScale }] }]}>
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
        onRequestClose={handleModalCloseAction}
      >
        <View style={overlayStyles}>
          {modalContent}
        </View>
      </Modal>
    );
  };

  const visualConfiguration = getModalVisualConfiguration();
  const dynamicStyles = createDynamicStylesheet(visualConfiguration);
  const textContent = getModalTextContent();
  
  const modalContent = renderModalContent(
    visualConfiguration,
    dynamicStyles,
    textContent
  );
  
  const modalContainer = renderModalContainer(
    dynamicStyles.overlay,
    modalContent
  );

  return modalContainer;
};