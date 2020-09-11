<template>
  <div class="root">
     <div class="container">
          <ul class="progressbar">
            <li v-for="i in length" :key="i" :class="getClass(i, progress)" :title="tips[i - 1]">
            </li>
          </ul>
      </div>
  </div>
</template>

<script>
    export default {
        name: 'progressStep',
        props: [
            'length',
            'progress',
            'tips'
        ],
        components: {
        },
        data() {
            return { };
        },
        methods: {
            getClass(i, progress) {
                if (i == progress) {
                    return 'last-active';
                } else if (i < progress) {
                    return 'active';
                } else {
                    return '';
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .container{
        width: 100%;
        position: relative;
        z-index: 1;
        margin-top: 20px;
        padding: 0;
    }

    .progressbar {
        counter-reset: step;
        padding: 0;
    }

    .progressbar li {
        float: left;
        width: 11%;
        position: relative;
        text-align: center;
    }

    .progressbar li:before {
        content:counter(step);
        counter-increment: step;
        width: 30px;
        height: 30px;
        border: 2px solid #A6A6A6;
        display: block;
        margin: 0 auto 10px auto;
        border-radius: 50%;
        line-height: 27px;
        background :#A6A6A6;
        color: white;

        font-style: normal;
        font-weight: 800;
        font-size: 20px;
        line-height: 27px;
    }

    .progressbar li:after {
        content: '';
        position: absolute;
        width:100%;
        height: 5px;
        background: #979797;
        top: 15px;
        left: -50%;
        z-index: -1;
    }

    .progressbar li.last-active:before {
        border-color: #4472E9;
        background: #4472E9;
        color: white;
        box-shadow: 2px 1px 4px 0px #000000c2;
    }

    .progressbar li.active:before {
        border-color: #43905b;
        background: #43905b;
        color: white;
    }

    .progressbar li.active:after {
        background: #43905b;
    }

    .progressbar li.active-li:after {
        background: #43905b;
    }

    .progressbar li.last-active:after {
        background: #4472E9;
    }

    .progressbar li.last-active-li:after {
        background: #4472E9;
    }


    .progressbar li.active-li:before {
        border-color: #3aac5d;
        background: #3aac5d;
        color: white
    }

    .progressbar li:first-child:after {
        content: none;
    }

</style>