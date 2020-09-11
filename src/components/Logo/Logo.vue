<template>
    <div class="logo" :class="`logo--${ variant }`">
        <h1 class="logo-title">Antenas</h1>
        <h2 class="logo-subtitle">
            Um projeto FATEC
        </h2>
    </div>
</template>

<script>
import "@/scss/_reset.scss";
import "@/scss/_variables.scss";
import "@/scss/_functions.scss";
import "@/scss/_fonts.scss";
import "@/scss/_global.scss";
import "@/scss/_icons.scss";
import "@/scss/_box.scss";

export default {
    name: 'Logo',
    props: {
        variant: String
    }
}
</script>

<style lang="scss" scoped>
    .logo {
        display: inline-flex;
        align-items: center;
        flex-direction: column;
        color: white;

        .logo-title {
            font-weight: 600;
            font-size: 24px !important;
            font-style: normal;
        }

        .logo-subtitle {
            font-weight: 200;
            font-size: 12px;
            margin-bottom: 6px;
            font-style: normal;
        }

        &--blue {
            color: #4472E9;
        }
    }
</style>